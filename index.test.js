// index.test.js

jest.mock('@line/bot-sdk');

const { handleEvent } = require('./index');

// Mock LINE SDK Client
jest.mock('@line/bot-sdk', () => {
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                replyMessage: jest.fn(() => Promise.resolve('mocked response'))
            };
        }),
        middleware: jest.fn()
    };
});

describe('handleEvent', () => {
    it('should reply with correct message when event is text message', async () => {
        const mockEvent = {
            type: 'message',
            message: {
                type: 'text',
                text: 'Hello'
            },
            replyToken: 'dummyToken'
        };

        const response = await handleEvent(mockEvent);
        expect(response).toBe('mocked response');
    });

    it('should resolve null for non-text message', async () => {
        const mockEvent = {
            type: 'message',
            message: {
                type: 'image',
                text: ''
            },
            replyToken: 'dummyToken'
        };

        const response = await handleEvent(mockEvent);
        expect(response).toBeNull();
    });

    it('should resolve null for non-message event', async () => {
        const mockEvent = {
            type: 'follow',
            replyToken: 'dummyToken'
        };

        const response = await handleEvent(mockEvent);
        expect(response).toBeNull();
    });
});