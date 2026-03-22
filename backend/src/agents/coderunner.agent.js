const { runCode, extractCodeBlock } = require('../services/coderunner.service');

const runCodeAgent = async (userMessage) => {
  const code = extractCodeBlock(userMessage);
  const result = await runCode(code);

  return {
    type: 'code_execution',
    code,
    result,
    context: result.success
      ? `Code executed in ${result.duration}.\nOutput: ${JSON.stringify(result.result)}`
      : `Code failed: ${result.error}`,
  };
};

module.exports = { runCodeAgent };
