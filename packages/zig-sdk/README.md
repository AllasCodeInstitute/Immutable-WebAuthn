# SimpleWebAuthn Zig SDK

A small, dependency-free Zig SDK for server-side WebAuthn option generation and shared WebAuthn utilities. The SDK is intentionally self-contained so it can be vendored into Zig services without changing the existing TypeScript/Deno packages in this repository.

## Install

Add this package as a dependency in your `build.zig.zon`, then import the module from your `build.zig`:

```zig
const simplewebauthn = b.dependency("simplewebauthn", .{
    .target = target,
    .optimize = optimize,
});
exe.root_module.addImport("simplewebauthn", simplewebauthn.module("simplewebauthn"));
```

## Example

```zig
const std = @import("std");
const webauthn = @import("simplewebauthn");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const challenge = try webauthn.generateChallenge(allocator, 32);
    defer allocator.free(challenge);

    const json = try webauthn.generateRegistrationOptionsJson(allocator, .{
        .rp = .{ .name = "Example", .id = "example.com" },
        .user = .{ .id = "user-123", .name = "jane@example.com", .display_name = "Jane" },
        .challenge = challenge,
    });
    defer allocator.free(json);
}
```

## Current surface

- `generateChallenge`: creates a cryptographically-random base64url challenge.
- `generateRegistrationOptionsJson`: serializes PublicKeyCredentialCreationOptions-compatible JSON.
- `generateAuthenticationOptionsJson`: serializes PublicKeyCredentialRequestOptions-compatible JSON.
- `base64UrlEncode` and `base64UrlDecode`: WebAuthn-safe base64url helpers.
- `constantTimeEqual`: constant-time byte comparison helper for verification flows.

Full attestation and assertion verification is intentionally not included yet; this package establishes a Zig-native foundation without modifying existing packages.
