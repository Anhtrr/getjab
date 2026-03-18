import Foundation
import UIKit
import AVFoundation
import Capacitor

@objc(NativeAudioPlayerPlugin)
public class NativeAudioPlayerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NativeAudioPlayerPlugin"
    public let jsName = "NativeAudioPlayer"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "preload", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "play", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopAll", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startDucking", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopDucking", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "shareImage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepAwake", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "allowSleep", returnType: CAPPluginReturnPromise),
    ]

    private var players: [String: AVAudioPlayer] = [:]
    private var completionCallIds: [String: String] = [:]
    private var pendingCalls: [String: CAPPluginCall] = [:]

    private func findAudioFile(_ path: String) -> URL? {
        // Try the public directory (where Capacitor copies web assets)
        if let resourceURL = Bundle.main.resourceURL {
            let publicURL = resourceURL.appendingPathComponent("public").appendingPathComponent(path)
            if FileManager.default.fileExists(atPath: publicURL.path) {
                return publicURL
            }
        }

        // Try direct bundle lookup by filename
        let filename = (path as NSString).deletingPathExtension
        let ext = (path as NSString).pathExtension
        let dir = (path as NSString).deletingLastPathComponent

        if let url = Bundle.main.url(forResource: (filename as NSString).lastPathComponent,
                                      withExtension: ext,
                                      subdirectory: "public/\(dir)") {
            return url
        }

        // Try without subdirectory
        if let url = Bundle.main.url(forResource: (filename as NSString).lastPathComponent,
                                      withExtension: ext) {
            return url
        }

        return nil
    }

    @objc func preload(_ call: CAPPluginCall) {
        guard let assetId = call.getString("assetId"),
              let path = call.getString("path") else {
            call.reject("Missing assetId or path")
            return
        }

        guard let fileURL = findAudioFile(path) else {
            call.reject("File not found: \(path)")
            return
        }

        do {
            let player = try AVAudioPlayer(contentsOf: fileURL)
            player.prepareToPlay()
            players[assetId] = player
            call.resolve()
        } catch {
            call.reject("Failed to preload: \(error.localizedDescription)")
        }
    }

    @objc func play(_ call: CAPPluginCall) {
        guard let assetId = call.getString("assetId") else {
            call.reject("Missing assetId")
            return
        }

        let volume = call.getFloat("volume") ?? 1.0

        guard let player = players[assetId] else {
            // Asset not preloaded, resolve immediately so chain continues
            call.resolve()
            return
        }

        // Ensure audio session is active
        do {
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {}

        // Store call for resolution when playback finishes
        let callId = UUID().uuidString
        pendingCalls[callId] = call
        completionCallIds[assetId] = callId

        player.volume = volume
        player.currentTime = 0
        player.delegate = self
        player.play()
    }

    @objc func stop(_ call: CAPPluginCall) {
        guard let assetId = call.getString("assetId") else {
            call.reject("Missing assetId")
            return
        }

        if let player = players[assetId] {
            player.stop()
            if let callId = completionCallIds.removeValue(forKey: assetId),
               let pendingCall = pendingCalls.removeValue(forKey: callId) {
                pendingCall.resolve()
            }
        }
        call.resolve()
    }

    @objc func startDucking(_ call: CAPPluginCall) {
        do {
            try AVAudioSession.sharedInstance().setCategory(
                .playback,
                options: [.mixWithOthers, .duckOthers]
            )
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {}
        call.resolve()
    }

    @objc func stopDucking(_ call: CAPPluginCall) {
        do {
            try AVAudioSession.sharedInstance().setCategory(
                .playback,
                options: [.mixWithOthers]
            )
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {}
        call.resolve()
    }

    @objc func keepAwake(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = true
        }
        call.resolve()
    }

    @objc func allowSleep(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = false
        }
        call.resolve()
    }

    @objc func stopAll(_ call: CAPPluginCall) {
        for (id, player) in players {
            player.stop()
            if let callId = completionCallIds.removeValue(forKey: id),
               let pendingCall = pendingCalls.removeValue(forKey: callId) {
                pendingCall.resolve()
            }
        }
        call.resolve()
    }

    @objc func shareImage(_ call: CAPPluginCall) {
        guard let base64 = call.getString("base64") else {
            NSLog("[JAB-SHARE] Missing base64 data")
            call.reject("Missing base64 data")
            return
        }

        NSLog("[JAB-SHARE] Received base64, length: \(base64.count)")

        guard let imageData = Data(base64Encoded: base64) else {
            NSLog("[JAB-SHARE] Failed to decode base64 to Data")
            call.reject("Invalid base64 data")
            return
        }

        NSLog("[JAB-SHARE] Data decoded, size: \(imageData.count) bytes")

        guard let image = UIImage(data: imageData) else {
            NSLog("[JAB-SHARE] Failed to create UIImage from data")
            call.reject("Invalid image data")
            return
        }

        NSLog("[JAB-SHARE] UIImage created: \(image.size.width)x\(image.size.height)")

        DispatchQueue.main.async {
            let activityVC = UIActivityViewController(
                activityItems: [image],
                applicationActivities: nil
            )

            // iPad requires sourceView
            if let popover = activityVC.popoverPresentationController {
                popover.sourceView = self.bridge?.viewController?.view
                popover.sourceRect = CGRect(
                    x: UIScreen.main.bounds.midX,
                    y: UIScreen.main.bounds.midY,
                    width: 0,
                    height: 0
                )
            }

            activityVC.completionWithItemsHandler = { activityType, completed, _, error in
                NSLog("[JAB-SHARE] Activity completed: \(completed), type: \(String(describing: activityType)), error: \(String(describing: error))")
                if let error = error {
                    call.reject(error.localizedDescription)
                } else {
                    call.resolve(["completed": completed])
                }
            }

            NSLog("[JAB-SHARE] Presenting UIActivityViewController")
            self.bridge?.viewController?.present(activityVC, animated: true)
        }
    }
}

extension NativeAudioPlayerPlugin: AVAudioPlayerDelegate {
    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        for (assetId, p) in players where p === player {
            if let callId = completionCallIds.removeValue(forKey: assetId),
               let pendingCall = pendingCalls.removeValue(forKey: callId) {
                pendingCall.resolve()
            }
            break
        }
    }
}
