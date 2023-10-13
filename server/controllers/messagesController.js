const MessageModel = require("../model/MessageModel");
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2022-04-07',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: 'https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/169adb61-0d0c-4e4d-ba34-1ed3b7c45713',
});

module.exports.addMessage = async(req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await MessageModel.create({
            message: {text: message },
            users: [from, to],
            sender: from, 
        });
        if(data) {
            const messageText = data.message.text;

            const analyzeParams = {
                text: messageText,
                features: {
                    emotion: {}
                }
            };
            const emojiMapping = {
                sadness: "😢",
                joy: "😄",
                fear: "😨",
                disgust: "🤢",
                anger: "😡",
            };
            try {
                const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
                if(analysisResults.result.emotion) {
                    const emotions = analysisResults.result.emotion.document.emotion;
                    const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
                    console.log("Emotion with the highest score:", maxEmotion);
                    const emoji = emojiMapping[maxEmotion];
                    data.emotion = emoji;
                } else {
                    console.log("No emotion data available for this message");
                }
            } catch (error) {
                console.error("error analyzing message:", error);
            }
            
            await data.save();

            return res.json({msg: "Message added successfully"});
        }
        return res.json({msg: "Failed to add message to the database"});
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllMessage = async(req, res, next) => {
    try {
        const {from, to} = req.body;
        const messages = await MessageModel.find({
            users: {
                $all: [from, to],
            },
        }).sort({updatedAt: 1});
        const projectedMessages = messages.map((msg)=> {
            return {
                fromSelf:msg.sender.toString() === from,
                message:msg.message.text,
                emotion: msg.emotion,
            };
        });
        res.json(projectedMessages);
    } catch(ex) {
        next(ex);
    }
};