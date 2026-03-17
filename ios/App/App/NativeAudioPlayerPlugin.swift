import Foundation
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
            NSLog("[JAB] preloaded '\(assetId)' from \(fileURL.path)")
            call.resolve()
        } catch {
            NSLog("[JAB] preload FAILED '\(assetId)': \(error.localizedDescription)")
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

        let session = AVAudioSession.sharedInstance()
        NSLog("[JAB] play '\(assetId)' - category: \(session.category.rawValue), options: \(session.categoryOptions.rawValue), isOtherAudioPlaying: \(session.isOtherAudioPlaying)")

        // Store call for resolution when playback finishes
        let callId = UUID().uuidString
        pendingCalls[callId] = call
        completionCallIds[assetId] = callId

        player.volume = volume
        player.currentTime = 0
        player.delegate = self
        player.play()
        NSLog("[JAB] player.isPlaying: \(player.isPlaying), duration: \(player.duration)")
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
        let session = AVAudioSession.sharedInstance()
        NSLog("[JAB] startDucking - current category: \(session.category.rawValue), options: \(session.categoryOptions.rawValue)")
        do {
            try session.setCategory(
                .playback,
                options: [.mixWithOthers, .duckOthers]
            )
            try session.setActive(true)
            NSLog("[JAB] startDucking SUCCESS - category: \(session.category.rawValue), options: \(session.categoryOptions.rawValue)")
        } catch let error {
            NSLog("[JAB] startDucking FAILED: \(error.localizedDescription)")
        }
        call.resolve()
    }

    @objc func stopDucking(_ call: CAPPluginCall) {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(
                .playback,
                options: [.mixWithOthers]
            )
            try session.setActive(true)
            NSLog("[JAB] stopDucking SUCCESS")
        } catch let error {
            NSLog("[JAB] stopDucking FAILED: \(error.localizedDescription)")
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
