import UIKit
import Capacitor

class JabViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Enable elastic scroll bounce to match native iOS feel
        webView?.scrollView.bounces = true
        webView?.scrollView.alwaysBounceVertical = true
    }
}
