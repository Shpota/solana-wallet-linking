package com.shpota;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.javalin.Javalin;
import io.javalin.plugin.bundled.CorsPluginConfig;
import org.sol4k.Base58;
import org.sol4k.PublicKey;

public class Main {
    public static void main(String[] args) {
        var app = Javalin.create(config -> {
                    config.plugins.enableCors(cors ->
                            cors.add(CorsPluginConfig::anyHost)
                    );
                    config.staticFiles.add("public");
                }
        );
        app.post("/verify", ctx -> {
            var request = new ObjectMapper().readValue(ctx.body(), VerificationRequest.class);
            Boolean result = verifySignature(request.signature(), request.walletAddress());
            ctx.result(result.toString());
        });
        app.start(8080);
    }

    public static Boolean verifySignature(String signature, String walletAddress) {
        String message = "You are verifying you wallet with sol4k";
        byte[] messageBytes = message.getBytes();
        PublicKey publicKey = new PublicKey(walletAddress);
        byte[] signatureBytes = Base58.decode(signature);
        return publicKey.verify(signatureBytes, messageBytes);
    }
}