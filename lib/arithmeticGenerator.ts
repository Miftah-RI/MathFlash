export interface Question {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function generateArithmeticQuestions(count: number, topic: string): Question[] {
  const questions: Question[] = [];
  const operations = ['+', '-', '×', '÷'];

  for (let i = 0; i < count; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1 = 0, num2 = 0, answer = 0;

    switch (op) {
      case '+':
        num1 = Math.floor(Math.random() * 90) + 10; // 10 to 99
        num2 = Math.floor(Math.random() * 90) + 10;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 100) + 20;
        num2 = Math.floor(Math.random() * num1); // ensure num2 < num1 so answer > 0
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 20) + 2; // 2 to 21
        num2 = Math.floor(Math.random() * 10) + 2; // 2 to 11
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 2; // 2 to 13
        answer = Math.floor(Math.random() * 20) + 2; // answer is between 2 and 21
        num1 = num2 * answer;
        break;
    }

    const questionStr = `Berapakah ${num1} ${op} ${num2}?`;
    
    // Generate options
    let options = new Set<string>();
    options.add(answer.toString());
    
    while (options.size < 4) {
      // create plausible wrong answers
      let offset = Math.floor(Math.random() * 10) - 5;
      if (offset === 0) offset = 1;
      let wrongAnswer = answer + offset;
      if (wrongAnswer < 0) wrongAnswer = answer + Math.floor(Math.random() * 10) + 1;
      options.add(wrongAnswer.toString());
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    questions.push({
      id: `aritmatika-${Date.now()}-${i}`,
      topic,
      question: questionStr,
      options: shuffledOptions,
      correctAnswer: answer.toString(),
    });
  }

  return questions;
}
