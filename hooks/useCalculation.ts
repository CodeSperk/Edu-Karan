"use client";

import { useState } from "react";
import { AdditionProblem } from "@/lib/generator/addition";
import { verifyAdditionAnswer, calculateScore } from "@/lib/calculation/addition";

import confetti from "canvas-confetti";

const playCorrectVoice = () => {
  if (typeof window === 'undefined') return;
  try {
    const phrases = ["Hoora!", "Yay!", "You did it!", "Excellent!", "Wonderful!", "Great job!"];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.pitch = 1.2 + (Math.random() * 0.4); 
    utterance.rate = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    // Trigger celebration fireworks
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
        zIndex: 100
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
        zIndex: 100
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  } catch(e) {}
}

const playErrorVoice = () => {
  if (typeof window === 'undefined') return;
  try {
    const phrases = ["Try again!", "Oops, try again!", "Not quite, try again!"];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.pitch = 0.9; 
    utterance.rate = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch(e) {}
}

const playErrorBeep = () => {
  playErrorVoice();
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

export function useCalculation(problems: AdditionProblem[]) {
  // Map of problem.id -> user's inputted number
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  
  const submitAnswer = (problemId: string, answer: number | null, suppressAudio = false) => {
    if (answer !== null && !suppressAudio) {
      const problem = problems.find(p => p.id === problemId);
      if (problem) {
         const isCompleteLength = answer.toString().length >= problem.correctAnswer.toString().length;
         if (answer === problem.correctAnswer) {
            playCorrectVoice();
         } else if (isCompleteLength) {
            playErrorBeep();
         }
      }
    }
    setAnswers(prev => ({ ...prev, [problemId]: answer }));
  };
  
  const checkAnswer = (problemId: string): boolean | null => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return null;
    const userAnswer = answers[problemId];
    if (userAnswer === undefined || userAnswer === null) return null;
    
    return verifyAdditionAnswer(problem, userAnswer);
  };
  
  const getScore = () => {
    return calculateScore(problems, answers);
  };

  const resetCalculation = () => {
    setAnswers({});
  };
  
  return { answers, submitAnswer, checkAnswer, getScore, resetCalculation };
}
