const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('C:\\Users\\user\\.gemini\\antigravity\\brain\\0f4aef48-427e-4dde-81ff-826e9fa39bc6\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let found = false;
  for await (const line of rl) {
    const data = JSON.parse(line);
    if (data.type === 'PLANNER_RESPONSE' && data.tool_calls) {
      for (const call of data.tool_calls) {
        if (call.name === 'write_to_file' || call.name === 'replace_file_content') {
          if (call.args && call.args.TargetFile && call.args.TargetFile.includes('App.jsx')) {
            if (call.args.CodeContent) {
              fs.writeFileSync('C:\\Ctempchem-search\\original_App.jsx', call.args.CodeContent);
              console.log('Original App.jsx extracted!');
              found = true;
              return;
            }
          }
        }
      }
    }
  }
}
extract();
