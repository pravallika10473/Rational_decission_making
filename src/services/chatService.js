import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openaiClient = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const anthropicClient = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatCompletion = async (model, messages, systemMessage) => {
  if (model !== 'claude-3-5-sonnet-20240620') {
    try {
      if (!process.env.REACT_APP_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const completion = await openaiClient.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemMessage },
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
  } else {
    try {
      if (!process.env.REACT_APP_ANTHROPIC_API_KEY) {
        throw new Error('Anthropic API key is not configured');
      }

      const completion = await anthropicClient.messages.create({
        model: model,
        max_tokens: 1024,
        system: systemMessage,
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
      });

      if (!completion.content || !completion.content[0]) {
        throw new Error('Invalid response from Anthropic API');
      }

      return {
        role: 'assistant',
        content: completion.content[0].text
      };
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw new Error(error.message || 'Failed to get response from Anthropic');
    }
  }
};