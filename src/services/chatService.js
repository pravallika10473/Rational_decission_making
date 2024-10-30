import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

export const getChatCompletion = async (model, messages) => {
  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages
      ]
    });
    return completion.choices[0].message;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
};
