const std = @import("std");

pub const WebAuthnError = error{
    ChallengeTooShort,
    EmptyRelyingPartyName,
    EmptyUserId,
    EmptyUserName,
};

pub const RelyingParty = struct {
    name: []const u8,
    id: ?[]const u8 = null,
};

pub const User = struct {
    id: []const u8,
    name: []const u8,
    display_name: []const u8,
};

pub const RegistrationOptions = struct {
    rp: RelyingParty,
    user: User,
    challenge: []const u8,
    timeout_ms: ?u32 = 60_000,
    attestation: []const u8 = "none",
    authenticator_attachment: ?[]const u8 = null,
    resident_key: ?[]const u8 = null,
    user_verification: []const u8 = "preferred",
};

pub const AuthenticationOptions = struct {
    challenge: []const u8,
    rp_id: ?[]const u8 = null,
    timeout_ms: ?u32 = 60_000,
    user_verification: []const u8 = "preferred",
};

pub fn generateChallenge(allocator: std.mem.Allocator, byte_len: usize) ![]u8 {
    if (byte_len < 16) return WebAuthnError.ChallengeTooShort;

    const random_bytes = try allocator.alloc(u8, byte_len);
    defer allocator.free(random_bytes);
    std.crypto.random.bytes(random_bytes);

    return base64UrlEncode(allocator, random_bytes);
}

pub fn base64UrlEncode(allocator: std.mem.Allocator, bytes: []const u8) ![]u8 {
    const encoder = std.base64.url_safe_no_pad.Encoder;
    const out = try allocator.alloc(u8, encoder.calcSize(bytes.len));
    _ = encoder.encode(out, bytes);
    return out;
}

pub fn base64UrlDecode(allocator: std.mem.Allocator, text: []const u8) ![]u8 {
    const decoder = std.base64.url_safe_no_pad.Decoder;
    const size = try decoder.calcSizeForSlice(text);
    const out = try allocator.alloc(u8, size);
    try decoder.decode(out, text);
    return out;
}

pub fn constantTimeEqual(a: []const u8, b: []const u8) bool {
    if (a.len != b.len) return false;
    var diff: u8 = 0;
    for (a, b) |left, right| diff |= left ^ right;
    return diff == 0;
}

pub fn generateRegistrationOptionsJson(allocator: std.mem.Allocator, options: RegistrationOptions) ![]u8 {
    if (options.rp.name.len == 0) return WebAuthnError.EmptyRelyingPartyName;
    if (options.user.id.len == 0) return WebAuthnError.EmptyUserId;
    if (options.user.name.len == 0) return WebAuthnError.EmptyUserName;

    var out = std.ArrayList(u8).init(allocator);
    errdefer out.deinit();
    const w = out.writer();

    try w.writeAll("{");
    try w.writeAll("\"rp\":{");
    try writeJsonField(w, "name", options.rp.name, false);
    if (options.rp.id) |rp_id| try writeJsonField(w, "id", rp_id, true);
    try w.writeAll("},\"user\":{");
    try writeJsonField(w, "id", options.user.id, false);
    try writeJsonField(w, "name", options.user.name, true);
    try writeJsonField(w, "displayName", options.user.display_name, true);
    try w.writeAll("},");
    try writeJsonField(w, "challenge", options.challenge, false);
    if (options.timeout_ms) |timeout| try w.print(",\"timeout\":{}", .{timeout});
    try w.writeAll(",\"pubKeyCredParams\":[{\"type\":\"public-key\",\"alg\":-7},{\"type\":\"public-key\",\"alg\":-257}]");
    try writeJsonField(w, "attestation", options.attestation, true);
    try w.writeAll(",\"authenticatorSelection\":{");
    var wrote_selection = false;
    if (options.authenticator_attachment) |attachment| {
        try writeJsonField(w, "authenticatorAttachment", attachment, false);
        wrote_selection = true;
    }
    if (options.resident_key) |resident_key| {
        try writeJsonField(w, "residentKey", resident_key, wrote_selection);
        wrote_selection = true;
    }
    try writeJsonField(w, "userVerification", options.user_verification, wrote_selection);
    try w.writeAll("}}");

    return out.toOwnedSlice();
}

pub fn generateAuthenticationOptionsJson(allocator: std.mem.Allocator, options: AuthenticationOptions) ![]u8 {
    var out = std.ArrayList(u8).init(allocator);
    errdefer out.deinit();
    const w = out.writer();

    try w.writeAll("{");
    try writeJsonField(w, "challenge", options.challenge, false);
    if (options.timeout_ms) |timeout| try w.print(",\"timeout\":{}", .{timeout});
    if (options.rp_id) |rp_id| try writeJsonField(w, "rpId", rp_id, true);
    try writeJsonField(w, "userVerification", options.user_verification, true);
    try w.writeAll("}");

    return out.toOwnedSlice();
}

fn writeJsonField(writer: anytype, comptime key: []const u8, value: []const u8, leading_comma: bool) !void {
    if (leading_comma) try writer.writeByte(',');
    try writer.print("\"{s}\":", .{key});
    try std.json.stringify(value, .{}, writer);
}

test "base64url round trip omits padding" {
    const allocator = std.testing.allocator;
    const encoded = try base64UrlEncode(allocator, "hello?");
    defer allocator.free(encoded);
    try std.testing.expectEqualStrings("aGVsbG8_", encoded);

    const decoded = try base64UrlDecode(allocator, encoded);
    defer allocator.free(decoded);
    try std.testing.expectEqualStrings("hello?", decoded);
}

test "constantTimeEqual compares byte slices" {
    try std.testing.expect(constantTimeEqual("same", "same"));
    try std.testing.expect(!constantTimeEqual("same", "diff"));
    try std.testing.expect(!constantTimeEqual("same", "same!"));
}

test "registration options JSON includes WebAuthn fields" {
    const allocator = std.testing.allocator;
    const json = try generateRegistrationOptionsJson(allocator, .{
        .rp = .{ .name = "Example", .id = "example.com" },
        .user = .{ .id = "user-123", .name = "jane@example.com", .display_name = "Jane" },
        .challenge = "abc123",
    });
    defer allocator.free(json);

    try std.testing.expect(std.mem.indexOf(u8, json, "\"challenge\":\"abc123\"") != null);
    try std.testing.expect(std.mem.indexOf(u8, json, "\"pubKeyCredParams\"") != null);
    try std.testing.expect(std.mem.indexOf(u8, json, "\"userVerification\":\"preferred\"") != null);
}

test "authentication options JSON includes challenge" {
    const allocator = std.testing.allocator;
    const json = try generateAuthenticationOptionsJson(allocator, .{
        .challenge = "abc123",
        .rp_id = "example.com",
    });
    defer allocator.free(json);

    try std.testing.expect(std.mem.indexOf(u8, json, "\"challenge\":\"abc123\"") != null);
    try std.testing.expect(std.mem.indexOf(u8, json, "\"rpId\":\"example.com\"") != null);
}
