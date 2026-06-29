const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const mod = b.addModule("simplewebauthn", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    const tests = b.addTest(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });
    tests.root_module.addImport("simplewebauthn", mod);

    const run_tests = b.addRunArtifact(tests);
    const test_step = b.step("test", "Run SimpleWebAuthn Zig SDK tests");
    test_step.dependOn(&run_tests.step);
}
