import { Component, OnInit } from '@angular/core';
import { env } from 'env';
const { Configuration, OpenAIApi } = require('openai');

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  title = 'chat-gpt3';
  messages: any = [];
  currentMessage = '';

  configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY
  });
  openai = new OpenAIApi(this.configuration);

  constructor() {
    this.messages.push({
      content: 'Hello, I am a bot that provides useful information to Computer Science students. Ask me about a relevant subject!',
      sentBy: 'bot'
    });
  }

  ngOnInit(): void {
  }

  async sendMessage() {
    // constrcut the request so that we send a string like `You: ${message[0]}\nFriend: ${message[1]}.\nYou: ${message[2]}?\nFriend:` to the API

    const request = {
      model: 'text-davinci-002',
      prompt: this.messages.map((m: any) => `${m.sentBy}: ${m.content}`).join('\n') + `\nuser: ${this.currentMessage}\nbot:`,
      max_tokens: 300,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['\n', ' user:', ' bot:']
    };
    console.log(request);

    // reset the current message
    this.messages.push({
      content: this.currentMessage,
      sentBy: 'user'
    });
    this.currentMessage = '';

    const response = await this.openai.createCompletion(request);
    console.log(response.data);

    this.messages.push({
      content: response.data.choices[0].text,
      sentBy: 'bot'
    });

    console.log(response.data.choices[0].text);
  }

}