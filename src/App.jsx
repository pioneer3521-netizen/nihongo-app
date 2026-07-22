import React, { useState, useEffect, useCallback } from 'react';

// 히라가나 & 가타카나 데이터 (50음도 기준)
const kanaData = [
  { ro: 'a', hi: 'あ', ka: 'ア' }, { ro: 'i', hi: 'い', ka: 'イ' }, { ro: 'u', hi: 'う', ka: 'ウ' }, { ro: 'e', hi: 'え', ka: 'エ' }, { ro: 'o', hi: 'お', ka: 'オ' },
  { ro: 'ka', hi: 'か', ka: 'カ' }, { ro: 'ki', hi: 'き', ka: 'キ' }, { ro: 'ku', hi: 'く', ka: 'ク' }, { ro: 'ke', hi: 'け', ka: 'ケ' }, { ro: 'ko', hi: 'こ', ka: 'コ' },
  { ro: 'sa', hi: 'さ', ka: 'サ' }, { ro: 'shi', hi: 'し', ka: 'シ' }, { ro: 'su', hi: 'す', ka: 'ス' }, { ro: 'se', hi: 'せ', ka: 'セ' }, { ro: 'so', hi: 'そ', ka: 'ソ' },
  { ro: 'ta', hi: 'た', ka: 'タ' }, { ro: 'chi', hi: 'ち', ka: 'チ' }, { ro: 'tsu', hi: 'つ', ka: 'ツ' }, { ro: 'te', hi: 'て', ka: 'テ' }, { ro: 'to', hi: 'と', ka: 'ト' },
  { ro: 'na', hi: 'な', ka: 'ナ' }, { ro: 'ni', hi: 'に', ka: 'ニ' }, { ro: 'nu', hi: 'ぬ', ka: 'ヌ' }, { ro: 'ne', hi: 'ね', ka: 'ネ' }, { ro: 'no', hi: 'の', ka: 'ノ' },
  { ro: 'ha', hi: 'は', ka: 'ハ' }, { ro: 'hi', hi: 'ひ', ka: 'ヒ' }, { ro: 'fu', hi: 'ふ', ka: 'フ' }, { ro: 'he', hi: 'へ', ka: 'ヘ' }, { ro: 'ho', hi: 'ほ', ka: 'ホ' },
  { ro: 'ma', hi: 'ま', ka: 'マ' }, { ro: 'mi', hi: 'み', ka: 'ミ' }, { ro: 'mu', hi: 'む', ka: 'ム' }, { ro: 'me', hi: 'め', ka: 'メ' }, { ro: 'mo', hi: 'も', ka: 'モ' },
  { ro: 'ya', hi: 'や', ka: 'ヤ' }, { ro: '', hi: '', ka: '' }, { ro: 'yu', hi: 'ゆ', ka: 'ユ' }, { ro: '', hi: '', ka: '' }, { ro: 'yo', hi: 'よ', ka: 'ヨ' },
  { ro: 'ra', hi: 'ら', ka: 'ラ' }, { ro: 'ri', hi: 'り', ka: 'リ' }, { ro: 'ru', hi: 'る', ka: 'ル' }, { ro: 're', hi: 'れ', ka: 'レ' }, { ro: 'ro', hi: 'ろ', ka: 'ロ' },
  { ro: 'wa', hi: 'わ', ka: 'ワ' }, { ro: '', hi: '', ka: '' }, { ro: '', hi: '', ka: '' }, { ro: '', hi: '', ka: '' }, { ro: 'wo', hi: 'を', ka: 'ヲ' },
  { ro: 'n', hi: 'ん', ka: 'ン' }, { ro: '', hi: '', ka: '' }, { ro: '', hi: '', ka: '' }, { ro: '', hi: '', ka: '' }, { ro: '', hi: '', ka: '' }
];

// 기초 단어 데이터
const vocabData = [
  { jp: 'こんにちは', kr: '안녕하세요 (낮)', ro: 'konnichiwa' },
  { jp: 'おはよう', kr: '안녕 (아침)', ro: 'ohayou' },
  { jp: 'こんばんは', kr: '안녕하세요 (밤)', ro: 'konbanwa' },
  { jp: 'ありがとう', kr: '고마워', ro: 'arigatou' },
  { jp: 'すみません', kr: '죄송합니다 / 실례합니다', ro: 'sumimasen' },
  { jp: 'はい', kr: '네', ro: 'hai' },
  { jp: 'いいえ', kr: '아니요', ro: 'iie' },
  { jp: 'さようなら', kr: '안녕히 계세요', ro: 'sayounara' },
  { jp: 'おいしい', kr: '맛있다', ro: 'oishii' },
  { jp: 'かわいい', kr: '귀엽다', ro: 'kawaii' },
  { jp: '水 (みず)', kr: '물', ro: 'mizu' },
  { jp: '学校 (がっこう)', kr: '학교', ro: 'gakkou' },
  { jp: '猫 (ねこ)', kr: '고양이', ro: 'neko' },
  { jp: '犬 (いぬ)', kr: '개', ro: 'inu' },
  { jp: 'りんご', kr: '사과', ro: 'ringo' },
  
  { jp: 'おやすみなさい', kr: '안녕히 주무세요', ro: 'oyasuminasai' },
  { jp: 'はじめまして', kr: '처음 뵙겠습니다', ro: 'hajimemashite' },
  { jp: 'お願いします (おねがいします)', kr: '부탁합니다', ro: 'onegaishimasu' },
  { jp: '私 (わたし)', kr: '나, 저', ro: 'watashi' },
  { jp: 'あなた', kr: '당신', ro: 'anata' },
  { jp: '家族 (かぞく)', kr: '가족', ro: 'kazoku' },
  { jp: '友達 (ともだち)', kr: '친구', ro: 'tomodachi' },
  { jp: '食べる (たべる)', kr: '먹다', ro: 'taberu' },
  { jp: '飲む (のむ)', kr: '마시다', ro: 'nomu' },
  { jp: '行く (いく)', kr: '가다', ro: 'iku' },
  { jp: '来る (くる)', kr: '오다', ro: 'kuru' },
  { jp: '見る (みる)', kr: '보다', ro: 'miru' },
  { jp: '大きい (おおきい)', kr: '크다', ro: 'ookii' },
  { jp: '小さい (ちいさい)', kr: '작다', ro: 'chiisai' },
  { jp: '高い (たかい)', kr: '높다, 비싸다', ro: 'takai' },
  { jp: '安い (やすい)', kr: '싸다', ro: 'yasui' },
  { jp: '山 (やま)', kr: '산', ro: 'yama' },
  { jp: '川 (かわ)', kr: '강', ro: 'kawa' },
  { jp: '海 (うみ)', kr: '바다', ro: 'umi' },
  { jp: '花 (はな)', kr: '꽃', ro: 'hana' },
  { jp: '本 (ほん)', kr: '책', ro: 'hon' },
  { jp: '車 (くるま)', kr: '자동차', ro: 'kuruma' },
  { jp: '時間 (じかん)', kr: '시간', ro: 'jikan' },
  { jp: 'お金 (おかね)', kr: '돈', ro: 'okane' },
  { jp: '天気 (てんき)', kr: '날씨', ro: 'tenki' },
  { jp: '今日 (きょう)', kr: '오늘', ro: 'kyou' },
  { jp: '明日 (あした)', kr: '내일', ro: 'ashita' },
  
  { jp: '昨日 (きのう)', kr: '어제', ro: 'kinou' },
  { jp: '明後日 (あさって)', kr: '모레', ro: 'asatte' },
  { jp: '毎日 (まいにち)', kr: '매일', ro: 'mainichi' },
  { jp: '朝 (あさ)', kr: '아침', ro: 'asa' },
  { jp: '昼 (ひる)', kr: '낮', ro: 'hiru' },
  { jp: '夜 (よる)', kr: '밤', ro: 'yoru' },
  
  { jp: '人 (ひと)', kr: '사람', ro: 'hito' },
  { jp: '男 (おとこ)', kr: '남자', ro: 'otoko' },
  { jp: '女 (おんな)', kr: '여자', ro: 'onna' },
  { jp: '子供 (こども)', kr: '아이', ro: 'kodomo' },
  { jp: '父 (ちち)', kr: '아버지 (나의)', ro: 'chichi' },
  { jp: '母 (はは)', kr: '어머니 (나의)', ro: 'haha' },
  
  { jp: '目 (め)', kr: '눈', ro: 'me' },
  { jp: '耳 (みみ)', kr: '귀', ro: 'mimi' },
  { jp: '口 (くち)', kr: '입', ro: 'kuchi' },
  { jp: '手 (て)', kr: '손', ro: 'te' },
  { jp: '足 (あし)', kr: '발, 다리', ro: 'ashi' },
  { jp: '頭 (あたま)', kr: '머리', ro: 'atama' },
  
  { jp: '暑い (あつい)', kr: '덥다', ro: 'atsui' },
  { jp: '寒い (さむい)', kr: '춥다', ro: 'samui' },
  { jp: '良い (いい/よい)', kr: '좋다', ro: 'ii / yoi' },
  { jp: '悪い (わるい)', kr: '나쁘다', ro: 'warui' },
  { jp: '広い (ひろい)', kr: '넓다', ro: 'hiroi' },
  { jp: '狭い (せまい)', kr: '좁다', ro: 'semai' },
  { jp: '多い (おおい)', kr: '많다', ro: 'ooi' },
  { jp: '少ない (すくない)', kr: '적다', ro: 'sukunai' },
  { jp: '新しい (あたらしい)', kr: '새롭다', ro: 'atarashii' },
  { jp: '古い (ふるい)', kr: '낡다, 오래되다', ro: 'furui' },
  
  { jp: 'する', kr: '하다', ro: 'suru' },
  { jp: '寝る (ねる)', kr: '자다', ro: 'neru' },
  { jp: '起きる (おきる)', kr: '일어나다', ro: 'okiru' },
  { jp: '買う (かう)', kr: '사다', ro: 'kau' },
  { jp: '読む (よむ)', kr: '읽다', ro: 'yomu' },
  { jp: '書く (かく)', kr: '쓰다', ro: 'kaku' },
  { jp: '聞く (きく)', kr: '듣다', ro: 'kiku' },
  { jp: '話す (はなす)', kr: '말하다', ro: 'hanasu' },
  { jp: '待つ (まつ)', kr: '기다리다', ro: 'matsu' },
  { jp: '分かる (わかる)', kr: '알다, 이해하다', ro: 'wakaru' }
];

const sentenceData = [
  { jp: 'これは何ですか。', kr: '이것은 무엇입니까?', ro: 'kore wa nan desu ka' },
  { jp: 'トイレはどこですか。', kr: '화장실은 어디입니까?', ro: 'toire wa doko desu ka' },
  { jp: 'いくらですか。', kr: '얼마입니까?', ro: 'ikura desu ka' },
  { jp: '日本語が少し話せます。', kr: '일본어를 조금 할 수 있습니다.', ro: 'nihongo ga sukoshi hanasemasu' },
  { jp: 'もう一度言ってください。', kr: '다시 한 번 말해주세요.', ro: 'mou ichido itte kudasai' },
  { jp: '助けてください！', kr: '도와주세요!', ro: 'tasukete kudasai' },
  { jp: '私は学生です。', kr: '나는 학생입니다.', ro: 'watashi wa gakusei desu' },
  { jp: '今、何時ですか。', kr: '지금 몇 시입니까?', ro: 'ima, nanji desu ka' },
  { jp: 'おすすめは何ですか。', kr: '추천하는 것은 무엇입니까?', ro: 'osusume wa nan desu ka' },
  { jp: 'とてもおいしいです。', kr: '매우 맛있습니다.', ro: 'totemo oishii desu' },
  { jp: 'お名前は何ですか。', kr: '성함이 어떻게 되시나요?', ro: 'onamae wa nan desu ka' },
  { jp: 'よろしくお願いします。', kr: '잘 부탁드립니다.', ro: 'yoroshiku onegaishimasu' },
  { jp: 'お疲れ様でした。', kr: '수고하셨습니다.', ro: 'otsukaresama deshita' },
  { jp: '大丈夫です。', kr: '괜찮습니다.', ro: 'daijoubu desu' },
  { jp: '写真を撮ってもらえませんか。', kr: '사진을 찍어주시겠어요?', ro: 'shashin o totte moraemasen ka' }
];

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const CharacterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const QuizIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const SpeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// 일본어 발음을 들려주는 유틸리티 함수
const speakJapanese = (text) => {
  if (!text) return;
  
  // 브라우저가 Web Speech API를 지원하는지 확인
  if ('speechSynthesis' in window) {
    // 기존 발음 중단
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP'; // 일본어로 설정
    utterance.rate = 0.8; // 발음 속도 (조금 느리게)
    window.speechSynthesis.speak(utterance);
  }
};

// 메인 홈 화면 컴포넌트
const HomeView = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-fade-in">
      <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center shadow-lg mb-4">
        <span className="text-6xl">🌸</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">일본어 기초 마스터</h1>
        <p className="text-gray-500">하루 10분, 쉽고 재미있게 공부하세요!</p>
      </div>
      
      {}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <button 
          onClick={() => setView('kana')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="bg-blue-50 p-3 rounded-full text-blue-500"><CharacterIcon /></div>
          <span className="font-semibold text-gray-700">문자 학습</span>
        </button>
        <button 
          onClick={() => setView('vocab')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="bg-green-50 p-3 rounded-full text-green-500"><BookIcon /></div>
          <span className="font-semibold text-gray-700">단어장</span>
        </button>
        <button 
          onClick={() => setView('quiz')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="bg-purple-50 p-3 rounded-full text-purple-500"><QuizIcon /></div>
          <span className="font-semibold text-gray-700">단어 퀴즈</span>
        </button>
        <button 
          onClick={() => setView('sentenceQuiz')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col items-center gap-3"
        >
          <div className="bg-orange-50 p-3 rounded-full text-orange-500"><MessageIcon /></div>
          <span className="font-semibold text-gray-700">문장 퀴즈</span>
        </button>
      </div>
    </div>
  );
};

// 히라가나/가타카나 학습 화면 컴포넌트
const KanaView = () => {
  const [mode, setMode] = useState('hiragana'); // 'hiragana' or 'katakana'

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">문자 학습</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${mode === 'hiragana' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-500'}`}
            onClick={() => setMode('hiragana')}
          >
            히라가나
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${mode === 'katakana' ? 'bg-white shadow-sm text-blue-500' : 'text-gray-500'}`}
            onClick={() => setMode('katakana')}
          >
            가타카나
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl mb-6 text-sm flex items-start gap-2">
        <SpeakerIcon />
        <span>글자를 클릭하면 원어민 발음을 들을 수 있어요!</span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {kanaData.map((item, index) => (
          <div key={index} className="aspect-square flex items-center justify-center">
            {item.ro ? (
              <button 
                onClick={() => speakJapanese(mode === 'hiragana' ? item.hi : item.ka)}
                className={`w-full h-full flex flex-col items-center justify-center rounded-xl shadow-sm border border-gray-200 transition transform active:scale-95 hover:bg-gray-50
                  ${mode === 'hiragana' ? 'hover:border-pink-300' : 'hover:border-blue-300'} bg-white`}
              >
                <span className="text-2xl sm:text-3xl font-medium text-gray-800 mb-1">
                  {mode === 'hiragana' ? item.hi : item.ka}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 font-mono">{item.ro}</span>
              </button>
            ) : (
              <div className="w-full h-full bg-transparent"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 단어장 (플래시카드) 화면 컴포넌트
const VocabView = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = vocabData[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % vocabData.length);
    }, 150); // 카드 뒤집히는 애니메이션 후 변경
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + vocabData.length) % vocabData.length);
    }, 150);
  };

  return (
    <div className="p-6 max-w-md mx-auto flex flex-col h-full items-center pt-10 pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">필수 단어장</h2>
      <p className="text-gray-500 mb-8 text-sm">카드를 터치해서 뜻을 확인하세요.</p>

      {/* 플래시카드 영역 (간단한 CSS로 뒤집기 효과 구현) */}
      <div 
        className="w-full aspect-[4/3] perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* 앞면 (일본어) */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-green-100 rounded-3xl shadow-lg flex flex-col items-center justify-center p-6">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-green-500 p-2"
              onClick={(e) => {
                e.stopPropagation();
                speakJapanese(currentWord.jp);
              }}
            >
              <SpeakerIcon />
            </button>
            <span className="text-4xl font-bold text-gray-800 mb-4 text-center">{currentWord.jp}</span>
            <span className="text-lg text-gray-400 font-mono">[{currentWord.ro}]</span>
          </div>

          {/* 뒷면 (한국어) */}
          <div className="absolute w-full h-full backface-hidden bg-green-50 border-2 border-green-200 rounded-3xl shadow-lg flex flex-col items-center justify-center p-6 rotate-y-180">
            <span className="text-3xl font-bold text-green-800 text-center">{currentWord.kr}</span>
          </div>

        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex items-center justify-between w-full mt-10 px-4">
        <button 
          onClick={handlePrev}
          className="p-3 bg-white rounded-full shadow border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <span className="font-medium text-gray-500">
          {currentIndex + 1} / {vocabData.length}
        </span>
        <button 
          onClick={handleNext}
          className="p-3 bg-white rounded-full shadow border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

// 퀴즈 화면 컴포넌트
const QuizView = ({ setView }) => {
  const [quizPhase, setQuizPhase] = useState('setup'); // 'setup', 'playing', 'finished'
  const [quizLength, setQuizLength] = useState(5);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const startQuiz = useCallback((length) => {
    const num = length || quizLength;
    setQuizLength(num);
    const shuffled = [...vocabData].sort(() => 0.5 - Math.random()).slice(0, num);
    setQuestions(shuffled);
    setQuestionIndex(0);
    setScore(0);
    setQuizPhase('playing');
    setSelectedAnswer(null);
    setIsCorrect(null);
    generateOptions(shuffled[0], shuffled);
  }, [quizLength]);

  // 객관식 보기 생성 로직
  const generateOptions = (correctWord, currentQuestions) => {
    let wrongOptions = vocabData.filter(v => v.jp !== correctWord.jp);
    wrongOptions = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const allOptions = [correctWord, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleAnswer = (option) => {
    if (selectedAnswer !== null) return; 
    
    setSelectedAnswer(option);
    const correct = option.jp === questions[questionIndex].jp;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
    }
    
    // 발음 들려주기
    speakJapanese(questions[questionIndex].jp);

    // 1.5초 후 다음 문제로
    setTimeout(() => {
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        generateOptions(questions[questionIndex + 1], questions);
      } else {
        setQuizPhase('finished');
      }
    }, 1500);
  };

  if (quizPhase === 'setup') {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center h-full pt-10 pb-24 animate-fade-in">
        <div className="flex w-full justify-start mb-8">
          <button onClick={() => setView('home')} className="p-2 -ml-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-purple-600 hover:border-purple-300 transition shadow-sm" title="홈 화면으로">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </button>
        </div>
        <div className="text-6xl mb-6">🤔</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">단어 퀴즈</h2>
        <p className="text-gray-500 mb-8">몇 문제를 풀까요?</p>
        <div className="flex flex-col gap-4 w-full">
          {[5, 10, 15].map(num => (
            <button 
              key={num}
              onClick={() => startQuiz(num)}
              className="bg-white border-2 border-purple-100 p-4 rounded-2xl text-lg font-bold text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition shadow-sm flex justify-between items-center px-6"
            >
              <span>{num}문제 도전</span>
              <span className="text-2xl">👉</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (quizPhase === 'finished') {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center h-full pt-20 animate-fade-in pb-24">
        <div className="text-6xl mb-6">🏆</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료!</h2>
        <p className="text-lg text-gray-600 mb-8">
          총 {questions.length}문제 중 <span className="font-bold text-purple-600 text-2xl">{score}</span>문제를 맞췄어요.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button onClick={() => startQuiz(quizLength)} className="bg-purple-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:bg-purple-700 transition w-full">같은 문제 수로 다시 도전</button>
          <button onClick={() => setQuizPhase('setup')} className="bg-purple-50 text-purple-600 px-6 py-4 rounded-2xl font-bold shadow-sm hover:bg-purple-100 transition w-full">문제 수 다시 선택</button>
          <button onClick={() => setView('home')} className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition w-full">홈으로</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[questionIndex];

  return (
    <div className="p-6 max-w-md mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setQuizPhase('setup')} className="p-2 -ml-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-purple-600 hover:border-purple-300 transition shadow-sm" title="설정으로">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">단어 퀴즈</h2>
        </div>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
          {questionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center mb-8">
        <p className="text-gray-500 mb-4 text-sm">다음 단어의 뜻은 무엇일까요?</p>
        <h3 className="text-4xl font-bold text-gray-800 mb-2">{currentQ.jp}</h3>
        <p className="text-gray-400 font-mono text-sm">[{currentQ.ro}]</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => {
          let btnClass = "bg-white border-2 border-gray-100 text-gray-700 hover:border-purple-300 hover:bg-purple-50";
          if (selectedAnswer !== null) {
            if (opt.jp === currentQ.jp) {
              btnClass = "bg-green-100 border-2 border-green-500 text-green-800 font-bold"; 
            } else if (selectedAnswer.jp === opt.jp && !isCorrect) {
              btnClass = "bg-red-100 border-2 border-red-500 text-red-800 font-bold"; 
            } else {
              btnClass = "bg-gray-50 border-2 border-gray-100 text-gray-400 opacity-50"; 
            }
          }
          return (
            <button key={idx} onClick={() => handleAnswer(opt)} disabled={selectedAnswer !== null} className={`w-full p-4 rounded-xl text-left font-medium transition duration-200 ${btnClass}`}>
              {opt.kr}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 문장 퀴즈 화면 컴포넌트
const SentenceQuizView = ({ setView }) => {
  const [quizPhase, setQuizPhase] = useState('setup'); // 'setup', 'playing', 'finished'
  const [quizLength, setQuizLength] = useState(5);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const startQuiz = useCallback((length) => {
    const num = length || quizLength;
    setQuizLength(num);
    const shuffled = [...sentenceData].sort(() => 0.5 - Math.random()).slice(0, num);
    setQuestions(shuffled);
    setQuestionIndex(0);
    setScore(0);
    setQuizPhase('playing');
    setSelectedAnswer(null);
    setIsCorrect(null);
    generateOptions(shuffled[0], shuffled);
  }, [quizLength]);

  const generateOptions = (correctSentence, currentQuestions) => {
    let wrongOptions = sentenceData.filter(v => v.jp !== correctSentence.jp);
    wrongOptions = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const allOptions = [correctSentence, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleAnswer = (option) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(option);
    const correct = option.jp === questions[questionIndex].jp;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
    }
    
    speakJapanese(questions[questionIndex].jp);

    setTimeout(() => {
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        generateOptions(questions[questionIndex + 1], questions);
      } else {
        setQuizPhase('finished');
      }
    }, 1500);
  };

  if (quizPhase === 'setup') {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center h-full pt-10 pb-24 animate-fade-in">
        <div className="flex w-full justify-start mb-8">
          <button onClick={() => setView('home')} className="p-2 -ml-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-orange-500 hover:border-orange-300 transition shadow-sm" title="홈 화면으로">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </button>
        </div>
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">문장 퀴즈</h2>
        <p className="text-gray-500 mb-8">몇 문제를 풀까요?</p>
        <div className="flex flex-col gap-4 w-full">
          {[5, 10, 15].map(num => (
            <button 
              key={num}
              onClick={() => startQuiz(num)}
              className="bg-white border-2 border-orange-100 p-4 rounded-2xl text-lg font-bold text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition shadow-sm flex justify-between items-center px-6"
            >
              <span>{num}문제 도전</span>
              <span className="text-2xl">👉</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (quizPhase === 'finished') {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center justify-center h-full pt-20 animate-fade-in pb-24">
        <div className="text-6xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료!</h2>
        <p className="text-lg text-gray-600 mb-8">
          총 {questions.length}문제 중 <span className="font-bold text-orange-500 text-2xl">{score}</span>문제를 맞췄어요.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button onClick={() => startQuiz(quizLength)} className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:bg-orange-600 transition w-full">같은 문제 수로 다시 도전</button>
          <button onClick={() => setQuizPhase('setup')} className="bg-orange-50 text-orange-600 px-6 py-4 rounded-2xl font-bold shadow-sm hover:bg-orange-100 transition w-full">문제 수 다시 선택</button>
          <button onClick={() => setView('home')} className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition w-full">홈으로</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[questionIndex];

  return (
    <div className="p-6 max-w-md mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => setQuizPhase('setup')} className="p-2 -ml-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-orange-500 hover:border-orange-300 transition shadow-sm" title="설정으로">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">문장 퀴즈</h2>
        </div>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
          {questionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center mb-8">
        <p className="text-gray-500 mb-4 text-sm">다음 문장의 뜻은 무엇일까요?</p>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 leading-tight break-keep">{currentQ.jp}</h3>
        <p className="text-gray-400 font-mono text-sm">[{currentQ.ro}]</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => {
          let btnClass = "bg-white border-2 border-gray-100 text-gray-700 hover:border-orange-300 hover:bg-orange-50";
          if (selectedAnswer !== null) {
            if (opt.jp === currentQ.jp) {
              btnClass = "bg-green-100 border-2 border-green-500 text-green-800 font-bold";
            } else if (selectedAnswer.jp === opt.jp && !isCorrect) {
              btnClass = "bg-red-100 border-2 border-red-500 text-red-800 font-bold";
            } else {
              btnClass = "bg-gray-50 border-2 border-gray-100 text-gray-400 opacity-50";
            }
          }
          return (
            <button key={idx} onClick={() => handleAnswer(opt)} disabled={selectedAnswer !== null} className={`w-full p-4 rounded-xl text-left font-medium transition duration-200 ${btnClass}`}>
              {opt.kr}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 메인 애플리케이션 컴포넌트
export default function App() {
  const [currentView, setCurrentView] = useState('home'); // home, kana, vocab, quiz

  // CSS for 3D flip effect and animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .perspective-1000 { perspective: 1000px; }
      .transform-style-preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col selection:bg-pink-200">
      
      {/* 상단 헤더 */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 font-bold text-xl text-gray-800 cursor-pointer"
          onClick={() => setCurrentView('home')}
        >
          <span className="text-2xl">🇯🇵</span> Nihongo Learn
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        {currentView === 'home' && <HomeView setView={setCurrentView} />}
        {currentView === 'kana' && <KanaView />}
        {currentView === 'vocab' && <VocabView />}
        {currentView === 'quiz' && <QuizView setView={setCurrentView} />}
        {}
        {currentView === 'sentenceQuiz' && <SentenceQuizView setView={setCurrentView} />}
      </main>

      {}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-between p-1 sm:p-2">
          {[
            { id: 'home', icon: <HomeIcon />, label: '홈' },
            { id: 'kana', icon: <CharacterIcon />, label: '문자' },
            { id: 'vocab', icon: <BookIcon />, label: '단어장' },
            { id: 'quiz', icon: <QuizIcon />, label: '단어퀴즈' },
            { id: 'sentenceQuiz', icon: <MessageIcon />, label: '문장퀴즈' }
          ].map((navItem) => (
            <button
              key={navItem.id}
              onClick={() => setCurrentView(navItem.id)}
              className={`flex-1 flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl transition
                ${currentView === navItem.id ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="mb-1 transform scale-90 sm:scale-100">{navItem.icon}</div>
              <span className="text-[9px] sm:text-[10px] font-bold whitespace-nowrap">{navItem.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}