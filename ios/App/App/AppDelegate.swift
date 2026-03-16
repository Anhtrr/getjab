import UIKit
import AVFoundation
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure audio session to duck background music during voice callouts
        do {
            try AVAudioSession.sharedInstance().setCategory(
                .playback,
                options: [.mixWithOthers, .duckOthers]
            )
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {}

        DispatchQueue.main.async {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController,
               let webView = vc.webView {
                let bgColor = UIColor(red: 10/255, green: 10/255, blue: 10/255, alpha: 1) // #0a0a0a

                // Match the scroll bounce background to the app background
                webView.scrollView.backgroundColor = bgColor
                webView.backgroundColor = bgColor
                webView.isOpaque = false

                // Enable vertical bounce only
                webView.scrollView.bounces = true
                webView.scrollView.alwaysBounceVertical = true
                webView.scrollView.alwaysBounceHorizontal = false

                // Prevent horizontal scrolling entirely
                webView.scrollView.showsHorizontalScrollIndicator = false
                webView.scrollView.showsVerticalScrollIndicator = false
            }
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
