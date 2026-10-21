package app.coriace;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;

// Google Play's rating card, shown over the app. Google decides whether it actually shows (it
// limits how often) and never says whether a rating was given: the call always resolves.
@CapacitorPlugin(name = "InAppReview")
public class InAppReviewPlugin extends Plugin {

    @PluginMethod
    public void requestReview(PluginCall call) {
        ReviewManager manager = ReviewManagerFactory.create(getContext());
        manager.requestReviewFlow().addOnCompleteListener(request -> {
            if (!request.isSuccessful()) {
                call.resolve();
                return;
            }
            manager.launchReviewFlow(getActivity(), request.getResult()).addOnCompleteListener(flow -> call.resolve());
        });
    }
}
