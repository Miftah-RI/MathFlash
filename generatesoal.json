const fs = require('fs');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestions(amount) {
  const questions = [];
  const operations = ['+', '-', '×', '÷'];

  for (let i = 1; i <= amount; i++) {
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    // Logika perhitungan agar mental math tetap masuk akal dalam 10 detik
    if (op === '+') {
      num1 = getRandomInt(10, 500);
      num2 = getRandomInt(10, 500);
      answer = num1 + num2;
    } else if (op === '-') {
      num1 = getRandomInt(100, 999);
      num2 = getRandomInt(10, num1 - 1); 
      answer = num1 - num2;
    } else if (op === '×') {
      num1 = getRandomInt(5, 50); 
      num2 = getRandomInt(5, 25);
      answer = num1 * num2;
    } else if (op === '÷') {
      num2 = getRandomInt(2, 25); 
      answer = getRandomInt(5, 50);
      num1 = num2 * answer; 
    }

    const correctAnswerStr = answer.toString();

    // Buat 3 jawaban salah (distractor) yang angkanya mirip-mirip
    const optionsSet = new Set([correctAnswerStr]);
    while (optionsSet.size < 4) {
      const offset = getRandomInt(-20, 20);
      if (offset !== 0 && answer + offset >= 0) {
        optionsSet.add((answer + offset).toString());
      }
    }

    // Acak posisi pilihan ganda
    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    let questionText = `Berapakah ${num1} ${op} ${num2}?`;
    if (op === '÷') questionText = `Hasil dari ${num1} ÷ ${num2} adalah...`;
    if (op === '×') questionText = `Hasil kali ${num1} × ${num2} adalah...`;

    questions.push({
      id: `arit-auto-${i}`,
      topic: "Aritmatika Cepat",
      question: questionText,
      options: options,
      correctAnswer: correctAnswerStr
    });
  }
  return questions;
}

// UBAH ANGKA 1000 DI BAWAH INI SESUAI JUMLAH SOAL YANG KAMU MAU
const JUMLAH_SOAL = 100; 
const newQuestions = generateQuestions(JUMLAH_SOAL);

fs.writeFileSync('./data/aritmatika.json', JSON.stringify(newQuestions, null, 2));
console.log(`Sukses! ${JUMLAH_SOAL} soal Aritmatika Cepat berhasil dibuat dan disimpan di data/aritmatika.json.`);