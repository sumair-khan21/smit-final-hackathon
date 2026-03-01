const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("./env.config");

let model = null;

if (env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

module.exports = { model };
