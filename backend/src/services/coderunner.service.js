// secure-exec is ESM-only — use dynamic import() for CJS compatibility
let _runtime = null;

const getRuntime = async () => {
  if (_runtime) return _runtime;

  const {
    NodeRuntime,
    createNodeDriver,
    createNodeRuntimeDriverFactory,
  } = await import('secure-exec');

  _runtime = new NodeRuntime({
    systemDriver: createNodeDriver({
      permissions: {
        fs: () => ({ allow: false }),
        network: () => ({ allow: false }),
        childProcess: () => ({ allow: false }),
      },
    }),
    runtimeDriverFactory: createNodeRuntimeDriverFactory(),
    memoryLimit: 32,
    cpuTimeLimitMs: 5000,
  });

  return _runtime;
};

const runCode = async (code) => {
  try {
    const runtime = await getRuntime();
    const startTime = Date.now();
    const result = await runtime.run(code);
    return {
      success: true,
      result,
      duration: `${Date.now() - startTime}ms`,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const extractCodeBlock = (text) => {
  const match = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
};

module.exports = { runCode, extractCodeBlock };
