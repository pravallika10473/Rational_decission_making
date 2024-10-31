import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatCompletion = async (model, messages) => {
  try {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages
      ]
    });

    if (!completion.choices || !completion.choices[0]?.message) {
      throw new Error('Invalid response from OpenAI API');
    }

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw new Error(error.message || 'Failed to get response from OpenAI');
  }
};
