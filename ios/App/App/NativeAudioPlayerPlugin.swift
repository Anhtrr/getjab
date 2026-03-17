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
    ]

    private var players: [String: AVAudioPlayer] = [:]
    private var completionHandlers: [String: (CAPPluginCall)] = [:]

    @objc func preload(_ call: CAPPluginCall) {
        guard let assetId = call.getString("assetId"),
              let path = call.getString("path") else {
            call.reject("Missing assetId or path")
            return
        }

        // Look for file in the web assets directory
        guard let webDir = Bundle.main.resourceURL?.appendingPathComponent("public") else {
            call.reject("Cannot find public directory")
            return
        }

        let fileURL = webDir.appendingPathComponent(path)

        guard FileManager.default.fileExists(atPath: fileURL.path) else {
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
            call.reject("Asset not preloaded: \(assetId)")
            return
        }

        // Ensure audio session is active with ducking
        do {
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {}

        player.volume = volume
        player.currentTime = 0
        player.delegate = self
        completionHandlers[assetId] = call
        player.play()
    }

    @objc func stop(_ call: CAPPluginCall) {
        guard let assetId = call.getString("assetId") else {
            call.reject("Missing assetId")
            return
        }

        if let player = players[assetId] {
            player.stop()
            // Resolve any pending play call
            if let pendingCall = completionHandlers.removeValue(forKey: assetId) {
                pendingCall.resolve()
            }
        }
        call.resolve()
    }

    @objc func stopAll(_ call: CAPPluginCall) {
        for (id, player) in players {
            player.stop()
            if let pendingCall = completionHandlers.removeValue(forKey: id) {
                pendingCall.resolve()
            }
        }
        call.resolve()
    }
}

extension NativeAudioPlayerPlugin: AVAudioPlayerDelegate {
    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        for (id, p) in players where p === player {
            if let pendingCall = completionHandlers.removeValue(forKey: id) {
                pendingCall.resolve()
            }
            break
        }
    }
}
