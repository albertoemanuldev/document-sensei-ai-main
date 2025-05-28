
import React from 'react';
import { Button } from '@/components/ui/button';

interface SuggestedQuestionsProps {
  questions: string[];
  messages: any[];
  onQuestionClick: (question: string) => void;
}

const SuggestedQuestions = ({ questions, messages, onQuestionClick }: SuggestedQuestionsProps) => {
  if (questions.length === 0 || messages.length > 0) {
    return null;
  }

  return (
    <div className="bg-white/80 rounded-xl p-6 border border-gray-200 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Perguntas sugeridas sobre o documento:
      </h4>
      <div className="space-y-3">
        {questions.map((question, index) => (
          <Button
            key={index}
            onClick={() => onQuestionClick(question)}
            variant="outline"
            className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200 h-auto justify-start"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
