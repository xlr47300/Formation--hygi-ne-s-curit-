import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Globe2,
  Hand,
  HardHat,
  HeartPulse,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  SprayCan,
  TriangleAlert,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  contentByLanguage,
  copyByLanguage,
  fr,
  frCopy,
  languages,
  LanguageCode,
  LocaleContent,
  SiteCopy,
  Theme,
  ThemeId,
} from "./content";
import { uiExtrasByLanguage, type UiExtras } from "./content/ui";

type Screen = "welcome" | "languages" | "themes" | "theme" | "quiz" | "recap";
type ThemeProgress = { completed: ThemeId[]; inProgress: ThemeId[] };
type QuizState = { questionIndex: number; selected: number | null; score: number };

const STORAGE_PROGRESS = "pomembal.progress.v2";
const STORAGE_LANGUAGE = "pomembal.language";
const emptyProgress: ThemeProgress = { completed: [], inProgress: [] };
const emptyQuiz: QuizState = { questionIndex: 0, selected: null, score: 0 };

type LocaleContextValue = { content: LocaleContent; copy: SiteCopy; extras: UiExtras };
const LocaleContext = createContext<LocaleContextValue>({
  content: fr,
  copy: frCopy,
  extras: uiExtrasByLanguage.FR,
});

function useLocale() {
  return useContext(LocaleContext);
}

const themeIcons: Record<ThemeId, typeof ShieldCheck> = {
  entree: HardHat,
  mains: Hand,
  sante: HeartPulse,
  allergenes: UtensilsCrossed,
  fruits: PackageCheck,
  nettoyage: SprayCan,
  securite: ShieldCheck,
  urgence: TriangleAlert,
};

const reflexIcons = [HardHat, Hand, UtensilsCrossed, PackageCheck, SprayCan, CircleAlert, ShieldCheck, TriangleAlert];

function Brand() {
  return (
    <div className="brand" aria-label="Pomembal">
      <span className="brand-apple" aria-hidden="true"><i /></span>
      <span>POMEMBAL</span>
    </div>
  );
}

function Header({
  onBack,
  onLanguage,
  completedCount,
  languageSelected,
  language,
}: {
  onBack?: () => void;
  onLanguage?: () => void;
  completedCount: number;
  languageSelected: boolean;
  language: LanguageCode;
}) {
  const { content, copy, extras } = useLocale();
  const themes = content.themes;
  const percentage = Math.round((completedCount / themes.length) * 100);
  return (
    <header className="site-header">
      <div className="header-inner">
        {onBack ? (
          <button className="icon-button" onClick={onBack} aria-label={copy.header.back}>
            <ArrowLeft size={22} />
          </button>
        ) : <div className="header-spacer" />}
        <Brand />
        {languageSelected ? (
          <button className="language-chip" onClick={onLanguage} aria-label={copy.header.language}>{language}</button>
        ) : <span className="language-chip passive" aria-label="Français">FR</span>}
      </div>
      <div
        className="progress-line"
        role="progressbar"
        aria-label={copy.header.progress}
        aria-valuemin={0}
        aria-valuemax={8}
        aria-valuenow={completedCount}
        aria-valuetext={extras.progressText(completedCount)}
      >
        <span style={{ width: `${percentage}%` }} />
      </div>
    </header>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  const { copy, extras } = useLocale();
  const [firstPromise, secondPromise, thirdPromise] = extras.welcome.promises;
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker"><ShieldCheck size={18} /> {copy.welcome.kicker}</p>
          <h1>{copy.welcome.title}</h1>
          <p className="hero-subtitle">{copy.welcome.subtitle}</p>
          <div className="duration"><Clock3 size={19} /><span>{copy.welcome.duration}</span></div>
          <button className="primary-button" onClick={onStart}>
            {copy.welcome.start} <ArrowRight size={21} />
          </button>
        </div>
        <div className="hero-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-station.png" alt={extras.welcome.heroAlt} />
          <div className="hero-stamp"><Check size={18} /> {extras.welcome.stamp}</div>
        </div>
      </section>
      <section className="promise-strip" aria-label={extras.welcome.promiseLabel}>
        <div><CheckCircle2 /><span><strong>{firstPromise.title}</strong>{firstPromise.text}</span></div>
        <div><ShieldCheck /><span><strong>{secondPromise.title}</strong>{secondPromise.text}</span></div>
        <div><CircleAlert /><span><strong>{thirdPromise.title}</strong>{thirdPromise.text}</span></div>
      </section>
    </main>
  );
}

function LanguageChoice({ onSelect }: { onSelect: (code: LanguageCode) => void }) {
  const { copy } = useLocale();
  const hasUnavailableLanguage = languages.some((language) => !language.active);
  return (
    <main className="page-shell narrow-shell">
      <div className="section-heading centered">
        <span className="round-icon"><Globe2 /></span>
        <p className="kicker plain">{copy.languages.kicker}</p>
        <h1>{copy.languages.title}</h1>
        <p>{copy.languages.intro}</p>
      </div>
      <div className="language-list">
        {languages.map((language) => (
          <button
            key={language.code}
            className={`language-card ${language.active ? "active" : "disabled"}`}
            onClick={language.active ? () => onSelect(language.code) : undefined}
            disabled={!language.active}
            aria-label={`${language.native}, ${language.active ? copy.languages.available : copy.languages.soon}`}
          >
            <span className="language-code">{language.code}</span>
            <span className="language-name"><strong>{language.native}</strong>{language.active ? copy.languages.available : copy.languages.soon}</span>
            {language.active ? <ChevronRight /> : <LockKeyhole size={19} />}
          </button>
        ))}
      </div>
      {hasUnavailableLanguage && <p className="language-note">{copy.languages.note}</p>}
    </main>
  );
}

function Themes({
  progress,
  onOpen,
  onQuiz,
}: {
  progress: ThemeProgress;
  onOpen: (id: ThemeId) => void;
  onQuiz: () => void;
}) {
  const { content, copy, extras } = useLocale();
  const themes = content.themes;
  return (
    <main className="page-shell">
      <div className="section-heading themes-heading">
        <p className="kicker plain">{copy.themes.kicker}</p>
        <h1>{copy.themes.title}</h1>
        <p>{copy.themes.intro}</p>
        <span className="progress-summary">{extras.themeProgress(progress.completed.length)}</span>
      </div>
      <div className="theme-grid">
        {themes.map((theme) => {
          const Icon = themeIcons[theme.id];
          const completed = progress.completed.includes(theme.id);
          const inProgress = progress.inProgress.includes(theme.id) && !completed;
          const stateLabel = completed ? copy.themes.completed : inProgress ? copy.themes.inProgress : copy.themes.notStarted;
          return (
            <button
              key={theme.id}
              className={`theme-card ${theme.color} ${theme.available ? "" : "coming"} ${completed ? "completed" : ""} ${inProgress ? "started" : ""}`}
              onClick={() => theme.available && onOpen(theme.id)}
              disabled={!theme.available}
              aria-label={`${theme.number} — ${theme.title}. ${theme.available ? stateLabel : copy.themes.coming}`}
            >
              <span className="theme-number">{theme.number}</span>
              <span className="theme-icon"><Icon /></span>
              <span className="theme-copy">
                <strong>{theme.title}</strong>
                <small>{theme.description}</small>
                {theme.available && <span className="theme-state">{completed && <Check size={15} />}{inProgress && <span className="state-dot" />}{stateLabel}</span>}
              </span>
              {theme.available ? <ChevronRight className="theme-chevron" /> : <span className="soon">{copy.themes.coming}</span>}
            </button>
          );
        })}
      </div>
      <div className="quiz-invite">
        <div><Sparkles /><span><strong>{copy.themes.quizTitle}</strong><small>{copy.themes.quizMeta}</small></span></div>
        <button className="secondary-button" onClick={onQuiz}>{copy.themes.quizButton} <ArrowRight size={19} /></button>
      </div>
    </main>
  );
}

function ThemeDetail({
  theme,
  completed,
  justCompleted,
  nextTheme,
  onDone,
  onContinue,
  onBackToThemes,
}: {
  theme: Theme;
  completed: boolean;
  justCompleted: boolean;
  nextTheme?: Theme;
  onDone: () => void;
  onContinue: () => void;
  onBackToThemes: () => void;
}) {
  const { copy, extras } = useLocale();
  return (
    <main className={`theme-detail theme-${theme.color}`}>
      <section className={`theme-hero ${theme.image ? "" : "solo"}`}>
        <div className="theme-hero-copy">
          <span className="large-number">{theme.number}</span>
          <p className="kicker plain">{copy.theme.kicker}</p>
          <h1>{theme.title}</h1>
          <p>{theme.description}</p>
        </div>
        {theme.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={theme.image} alt={theme.imageAlt || ""} />
        )}
      </section>
      <div className="learning-stream">
        {theme.sections?.map((section, index) => (
          <article className={`learning-card ${section.tone || "light"}`} key={section.title}>
            <span className="step-dot">{String(index + 1).padStart(2, "0")}</span>
            <div>
              {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
              <h2>{section.title}</h2>
              {section.items && <ul>{section.items.map((item) => <li key={item}><Check size={19} />{item}</li>)}</ul>}
              {section.colorGroups && (
                <div className="color-groups">
                  {section.colorGroups.map((group) => (
                    <section className="color-group" key={group.title} aria-label={group.title}>
                      <h3>{group.title}</h3>
                      <ul>
                        {group.entries.map((entry) => (
                          <li key={entry.label}>
                            <span
                              className={`color-swatch ${entry.border ? "bordered" : ""}`}
                              style={{ backgroundColor: entry.color }}
                              aria-hidden="true"
                            />
                            {entry.label}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
              {section.statement && <p className="statement">{section.statement}</p>}
            </div>
          </article>
        ))}
        {theme.id === "securite" && (
          <figure className="inline-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/arret-urgence.png" alt={extras.emergencyAlt} />
            <figcaption>{extras.emergencyCaption}</figcaption>
          </figure>
        )}
      </div>
      <div className={`sticky-action ${completed ? "done" : ""}`}>
        {justCompleted ? (
          <div className="completion-actions confirmation-only" role="status" aria-live="assertive">
            <span className="completion-label"><CheckCircle2 /> {copy.theme.completed}</span>
            <button className="text-button" onClick={onBackToThemes}>{copy.theme.backToThemes}</button>
          </div>
        ) : completed ? (
          <div className="completion-actions" role="status">
            <span className="completion-label"><CheckCircle2 /> {copy.theme.completed}</span>
            <button className="primary-button" onClick={onContinue}>
              {nextTheme ? copy.theme.next : copy.theme.quiz} <ArrowRight size={20} />
            </button>
            <button className="text-button" onClick={onBackToThemes}>{copy.theme.backToThemes}</button>
          </div>
        ) : (
          <div className="completion-actions">
            <button className="primary-button" onClick={onDone}>{copy.theme.understood} <Check size={20} /></button>
            <button className="text-button" onClick={onBackToThemes}>{copy.theme.backToThemes}</button>
          </div>
        )}
      </div>
    </main>
  );
}

function Quiz({ quiz, setQuiz, onFinish }: { quiz: QuizState; setQuiz: React.Dispatch<React.SetStateAction<QuizState>>; onFinish: () => void }) {
  const { content, copy, extras } = useLocale();
  const { questionIndex, selected, score } = quiz;
  const question = content.quizQuestions[questionIndex];
  const isCorrect = selected === question.correct;

  const choose = (index: number) => {
    if (selected !== null) return;
    setQuiz((current) => ({
      ...current,
      selected: index,
      score: current.score + (index === question.correct ? 1 : 0),
    }));
  };

  const next = () => {
    if (questionIndex === content.quizQuestions.length - 1) {
      onFinish();
      return;
    }
    setQuiz((current) => ({ ...current, questionIndex: current.questionIndex + 1, selected: null }));
  };

  return (
    <main className="quiz-shell">
      <div className="quiz-topline">
        <span>{extras.quizPosition(questionIndex + 1, content.quizQuestions.length)}</span>
        <span>{extras.quizScore(score)}</span>
      </div>
      <div className="quiz-progress" role="progressbar" aria-label={extras.quizProgressLabel} aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={content.quizQuestions.length}>
        <span style={{ width: `${((questionIndex + 1) / content.quizQuestions.length) * 100}%` }} />
      </div>
      <section className="quiz-card">
        <div className="quiz-symbol"><ShieldCheck /></div>
        <p className="kicker plain">{copy.quiz.choose}</p>
        <h1>{question.question}</h1>
        <div className="answers">
          {question.answers.map((answer, index) => {
            const revealCorrect = selected !== null && index === question.correct;
            const revealWrong = selected === index && index !== question.correct;
            return (
              <button
                key={answer}
                className={`${selected === index ? "selected" : ""} ${revealCorrect ? "correct" : ""} ${revealWrong ? "wrong" : ""}`}
                onClick={() => choose(index)}
                disabled={selected !== null}
                aria-pressed={selected === index}
              >
                <span>{String.fromCharCode(65 + index)}</span>{answer}
                {revealCorrect && <Check size={20} />}{revealWrong && <X size={20} />}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className={`feedback ${isCorrect ? "good" : "learn"}`} role="status" aria-live="polite">
            {isCorrect ? <CheckCircle2 /> : <CircleAlert />}
            <div>
              <strong>{isCorrect ? copy.quiz.correct : copy.quiz.incorrect}</strong>
              <p>{isCorrect ? question.explanation : question.wrongExplanation || question.explanation}</p>
            </div>
          </div>
        )}
        <button className="primary-button quiz-next" onClick={next} disabled={selected === null}>
          {questionIndex === content.quizQuestions.length - 1 ? copy.quiz.finish : copy.quiz.next} <ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
}

function Recap({ onReview, onThemes }: { onReview: () => void; onThemes: () => void }) {
  const { content, copy } = useLocale();
  return (
    <main className="recap-shell">
      <section className="success-panel">
        <span className="success-icon"><Check /></span>
        <p className="kicker">{copy.recap.kicker}</p>
        <h1>{copy.recap.title}</h1>
        <p>{copy.recap.subtitle}</p>
      </section>
      <section className="recap-content">
        <div className="section-heading centered">
          <p className="kicker plain">{copy.recap.remember}</p>
          <h2>{copy.recap.reflexes}</h2>
        </div>
        <ol className="reflex-list">
          {content.essentialReflexes.map((reflex, index) => {
            const Icon = reflexIcons[index];
            return <li key={reflex}><span>{index + 1}</span><Icon size={20} />{reflex}</li>;
          })}
        </ol>
        <blockquote>{copy.recap.motto}</blockquote>
        <div className="final-reminder"><CircleAlert /><p><strong>{copy.recap.doubt}</strong><br />{copy.recap.ask}</p></div>
        <div className="recap-actions">
          <button className="primary-button" onClick={onReview}><ArrowLeft size={19} /> {copy.recap.review}</button>
          <button className="secondary-button" onClick={onThemes}>{copy.recap.themes}</button>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [language, setLanguage] = useState<LanguageCode>("FR");
  const [activeThemeId, setActiveThemeId] = useState<ThemeId | null>(null);
  const [progress, setProgress] = useState<ThemeProgress>(emptyProgress);
  const [quiz, setQuiz] = useState<QuizState>(emptyQuiz);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [languageReturn, setLanguageReturn] = useState<Screen | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [justCompletedThemeId, setJustCompletedThemeId] = useState<ThemeId | null>(null);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const content = contentByLanguage[language];
  const copy = copyByLanguage[language];
  const extras = uiExtrasByLanguage[language];
  const themes = content.themes;

  useEffect(() => {
    let savedProgress = emptyProgress;
    let savedLanguage: LanguageCode | null = null;
    try {
      const saved = window.localStorage.getItem(STORAGE_PROGRESS);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ThemeProgress>;
        savedProgress = {
          completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id): id is ThemeId => fr.themes.some((theme) => theme.id === id)) : [],
          inProgress: Array.isArray(parsed.inProgress) ? parsed.inProgress.filter((id): id is ThemeId => fr.themes.some((theme) => theme.id === id)) : [],
        };
      }
      const storedLanguage = window.localStorage.getItem(STORAGE_LANGUAGE);
      savedLanguage = languages.find((item) => item.code === storedLanguage && item.active)?.code ?? null;
    } catch {
      // Le parcours reste entièrement utilisable si le stockage local est indisponible.
    }
    const frame = window.requestAnimationFrame(() => {
      setProgress(savedProgress);
      if (savedLanguage) setLanguage(savedLanguage);
      setLanguageSelected(savedLanguage !== null);
      setStorageReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try { window.localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress)); } catch { /* stockage facultatif */ }
  }, [progress, storageReady]);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.dir = content.direction;
    document.title = `${copy.welcome.title} Pomembal`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.welcome.subtitle);
  }, [content.direction, copy.welcome.subtitle, copy.welcome.title, language]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [screen, activeThemeId]);

  useEffect(() => () => {
    if (completionTimer.current) window.clearTimeout(completionTimer.current);
  }, []);

  const activeTheme = themes.find((theme) => theme.id === activeThemeId) || null;
  const activeThemeIndex = themes.findIndex((theme) => theme.id === activeThemeId);
  const nextTheme = activeThemeIndex >= 0 ? themes[activeThemeIndex + 1] : undefined;

  const selectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setLanguageSelected(true);
    try { window.localStorage.setItem(STORAGE_LANGUAGE, code); } catch { /* stockage facultatif */ }
    setScreen(languageReturn && languageReturn !== "languages" ? languageReturn : "themes");
    setLanguageReturn(null);
  };

  const openLanguage = () => {
    setLanguageReturn(screen);
    setScreen("languages");
  };

  const openTheme = (id: ThemeId) => {
    setJustCompletedThemeId(null);
    setProgress((current) => current.completed.includes(id) || current.inProgress.includes(id)
      ? current
      : { ...current, inProgress: [...current.inProgress, id] });
    setActiveThemeId(id);
    setScreen("theme");
  };

  const startQuiz = () => {
    setQuiz(emptyQuiz);
    setScreen("quiz");
  };

  const clearCompletionTimer = () => {
    if (completionTimer.current) {
      window.clearTimeout(completionTimer.current);
      completionTimer.current = null;
    }
  };

  const continueFromTheme = (themeId: ThemeId) => {
    clearCompletionTimer();
    setJustCompletedThemeId(null);
    const currentIndex = themes.findIndex((theme) => theme.id === themeId);
    const followingTheme = currentIndex >= 0 ? themes[currentIndex + 1] : undefined;
    if (!followingTheme) {
      startQuiz();
      return;
    }
    if (!followingTheme.available) {
      setActiveThemeId(null);
      setScreen("themes");
      return;
    }
    openTheme(followingTheme.id);
  };

  const completeTheme = () => {
    if (!activeThemeId) return;
    const completedThemeId = activeThemeId;
    setProgress((current) => {
      const nextProgress = {
        completed: current.completed.includes(completedThemeId) ? current.completed : [...current.completed, completedThemeId],
        inProgress: current.inProgress.filter((id) => id !== completedThemeId),
      };
      try { window.localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(nextProgress)); } catch { /* stockage facultatif */ }
      return nextProgress;
    });
    setJustCompletedThemeId(completedThemeId);
    clearCompletionTimer();
    completionTimer.current = window.setTimeout(() => continueFromTheme(completedThemeId), 900);
  };

  const returnToThemes = () => {
    clearCompletionTimer();
    setJustCompletedThemeId(null);
    setActiveThemeId(null);
    setScreen("themes");
  };

  const back = () => {
    if (screen === "languages") {
      setScreen(languageReturn || "welcome");
      setLanguageReturn(null);
    } else if (screen === "themes") setScreen("welcome");
    else if (screen === "theme" || screen === "quiz" || screen === "recap") returnToThemes();
  };

  return (
    <LocaleContext.Provider value={{ content, copy, extras }}>
      <div className={`app-shell locale-${language.toLowerCase()}`} dir={content.direction} lang={language.toLowerCase()}>
        <Header
          onBack={screen === "welcome" ? undefined : back}
          onLanguage={openLanguage}
          completedCount={progress.completed.length}
          languageSelected={languageSelected}
          language={language}
        />
        {screen === "welcome" && <Welcome onStart={() => setScreen("languages")} />}
        {screen === "languages" && <LanguageChoice onSelect={selectLanguage} />}
        {screen === "themes" && <Themes progress={progress} onOpen={openTheme} onQuiz={startQuiz} />}
        {screen === "theme" && activeTheme && (
          <ThemeDetail
            theme={activeTheme}
            completed={progress.completed.includes(activeTheme.id)}
            justCompleted={justCompletedThemeId === activeTheme.id}
            nextTheme={nextTheme}
            onDone={completeTheme}
            onContinue={() => continueFromTheme(activeTheme.id)}
            onBackToThemes={returnToThemes}
          />
        )}
        {screen === "quiz" && <Quiz quiz={quiz} setQuiz={setQuiz} onFinish={() => setScreen("recap")} />}
        {screen === "recap" && <Recap onReview={() => openTheme("entree")} onThemes={() => setScreen("themes")} />}
      </div>
    </LocaleContext.Provider>
  );
}
