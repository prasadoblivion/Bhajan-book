package com.prasadoblivion.bhajanbook;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

public class MainActivity extends Activity {
    private WebView webView;

    private static class LocalContentWebViewClient extends WebViewClientCompat {
        private final WebViewAssetLoader assetLoader;

        LocalContentWebViewClient(WebViewAssetLoader assetLoader) {
            this.assetLoader = assetLoader;
        }

        private boolean handleExternalUrl(Uri uri) {
            if ("mailto".equalsIgnoreCase(uri.getScheme())) {
                Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
                if (intent.resolveActivity(viewContext.getPackageManager()) != null) {
                    viewContext.startActivity(intent);
                }
                return true;
            }
            return false;
        }

        private final Activity viewContext;

        LocalContentWebViewClient(WebViewAssetLoader assetLoader, Activity activity) {
            this.assetLoader = assetLoader;
            this.viewContext = activity;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleExternalUrl(request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleExternalUrl(Uri.parse(url));
        }

        @Override
        @Nullable
        public WebResourceResponse shouldInterceptRequest(
                WebView view,
                WebResourceRequest request
        ) {
            return assetLoader.shouldInterceptRequest(request.getUrl());
        }

        @Override
        @Nullable
        public WebResourceResponse shouldInterceptRequest(
                WebView view,
                String url
        ) {
            return assetLoader.shouldInterceptRequest(android.net.Uri.parse(url));
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        // The app is fully self-contained. Serve bundled files through
        // WebViewAssetLoader so fetch("./data/*.json") works with a
        // normal HTTPS-style origin instead of file://.
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);

        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler(
                        "/assets/",
                        new WebViewAssetLoader.AssetsPathHandler(this)
                )
                .build();

        webView.setWebViewClient(new LocalContentWebViewClient(assetLoader, this));
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
