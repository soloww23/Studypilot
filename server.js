import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
const app=express();
app.use(cors());app.use(express.json({limit:"12mb"}));app.use(express.static("."));
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const instructions=`You are StudyPilot, a patient multi-subject school tutor. Adapt your teaching to the selected subject.
Math: show formulas, substitutions, arithmetic checks, and explain each step.
English/ELA: explain grammar, reading comprehension, evidence, vocabulary, and writing structure.
Spanish/French: help with vocabulary, grammar, conjugation, translation, and pronunciation; explain why wording is correct.
Science: explain concepts, equations, units, experiments, and cause/effect.
History/Geography/Government/Economics: distinguish facts, dates, terms, causes, effects, and competing interpretations when relevant.
Computer Science: explain algorithms, code concepts, debugging, and examples.
For every subject, first explain the concept, then work through the question, then give a clearly labeled suggested answer. Encourage the student to review the reasoning. Do not submit work, impersonate the student, bypass school controls, or claim that you completed an assignment.`;
app.post("/api/tutor",async(req,res)=>{try{
const {subject="Auto Detect",question="",context="",image=""}=req.body;
const content=[{type:"input_text",text:`${instructions}\n\nSelected subject: ${subject}\nQuestion: ${question}\nLesson/context: ${context}`}];
if(image)content.push({type:"input_image",image_url:image});
const out=await client.responses.create({model:"gpt-5-mini",input:[{role:"user",content}]});
res.json({answer:out.output_text});
}catch(e){console.error(e);res.status(500).json({error:"AI request failed"})}});
app.listen(process.env.PORT||3000,()=>console.log("StudyPilot V3 running"));
