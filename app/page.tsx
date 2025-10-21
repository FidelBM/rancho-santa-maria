"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  Brain,
  Compass,
  Leaf,
  Sparkles,
  Share2,
  Eye,
  Sun,
  Star,
  LucideIcon,
  RefreshCw,
  X,
} from "lucide-react";

/** ================= Tipos ================= */
type Skin = {
  key: string;
  name: string;
  bg: string;
  cardRing: string;
  accentBtn: string;
  pathBg: string;
  hills: string;
  stationIcon: string;
  confetti: string[];
  tokenEmoji: string;
};

type Player = {
  name: string;
  iconKey: string;
  position: number; // 0..BOARD_SIZE-1
  laps: number; // vueltas completadas
};

type Stage = {
  key: string;
  title: string;
  icon: LucideIcon;
  color: string;
  question: string;
  options: string[];
  correct: number;
};

const MAX_PLAYERS = 10;

/** ================= Skins ================= */
const SKINS: Record<string, Skin> = {
  ranch: {
    key: "ranch",
    name: "Clásico Rancho 🐐",
    bg: "from-emerald-50 to-[#f8fff9]",
    cardRing: "ring-emerald-200",
    accentBtn: "bg-emerald-700 hover:bg-emerald-800 text-white",
    pathBg:
      "bg-[repeating-linear-gradient(90deg,#e5decf_0_16px,#d2c3a9_16px_20px)]",
    hills: "bg-[linear-gradient(0deg,#c6e6cf_0%,transparent_100%)]",
    stationIcon: "text-emerald-800",
    confetti: ["#14532d", "#16a34a", "#84cc16", "#facc15", "#f97316"],
    tokenEmoji: "🐐",
  },
  vineyard: {
    key: "vineyard",
    name: "Viñedo 🍇",
    bg: "from-[#f8fafc] to-[#fff7fb]",
    cardRing: "ring-purple-200",
    accentBtn: "bg-purple-700 hover:bg-purple-800 text-white",
    pathBg:
      "bg-[repeating-linear-gradient(90deg,#efe1f7_0_16px,#e0c8f0_16px_20px)]",
    hills: "bg-[linear-gradient(0deg,#e2d6f5_0%,transparent_100%)]",
    stationIcon: "text-purple-700",
    confetti: ["#6b21a8", "#8b5cf6", "#a78bfa", "#f472b6", "#f59e0b"],
    tokenEmoji: "🍇",
  },
  dairy: {
    key: "dairy",
    name: "Quesería 🧀",
    bg: "from-[#fffef7] to-[#fff9e6]",
    cardRing: "ring-amber-200",
    accentBtn: "bg-amber-700 hover:bg-amber-800 text-white",
    pathBg:
      "bg-[repeating-linear-gradient(90deg,#fff0cc_0_16px,#ffe399_16px_20px)]",
    hills: "bg-[linear-gradient(0deg,#ffe8b3_0%,transparent_100%)]",
    stationIcon: "text-amber-700",
    confetti: ["#f59e0b", "#fbbf24", "#fde68a", "#22c55e", "#a7f3d0"],
    tokenEmoji: "🧀",
  },
  garden: {
    key: "garden",
    name: "Huerto 🥕",
    bg: "from-[#f1fff4] to-[#eafff0]",
    cardRing: "ring-teal-200",
    accentBtn: "bg-teal-700 hover:bg-teal-800 text-white",
    pathBg:
      "bg-[repeating-linear-gradient(90deg,#d6fff2_0_16px,#baf7e7_16px_20px)]",
    hills: "bg-[linear-gradient(0deg,#bff7d5_0%,transparent_100%)]",
    stationIcon: "text-teal-700",
    confetti: ["#0d9488", "#14b8a6", "#22c55e", "#84cc16", "#facc15"],
    tokenEmoji: "🥕",
  },
};

/** ================= Iconos jugador ================= */
const ICON_SET: { key: string; Icon: LucideIcon; className: string }[] = [
  { key: "sun", Icon: Sun, className: "text-amber-600" },
  { key: "star", Icon: Star, className: "text-yellow-600" },
  { key: "heart", Icon: Heart, className: "text-rose-600" },
  { key: "leaf", Icon: Leaf, className: "text-emerald-700" },
  { key: "brain", Icon: Brain, className: "text-pink-700" },
  { key: "compass", Icon: Compass, className: "text-teal-700" },
  { key: "eye", Icon: Eye, className: "text-purple-700" },
  { key: "sparkles", Icon: Sparkles, className: "text-amber-700" },
];

/** ================= Preguntas ================= */
const STAGES: Stage[] = [
  {
    key: "S",
    title: "Strength – Fuerza",
    icon: Leaf,
    color: "from-emerald-50 to-emerald-100",
    question:
      "¿Cómo demuestra un líder fortaleza en Rancho Santa Marina durante momentos difíciles?",
    options: [
      "Ignorando los problemas para no preocupar al equipo.",
      "Enfrentando los retos con serenidad, escuchando y apoyando al grupo.",
      "Evitando involucrarse en conflictos del trabajo.",
    ],
    correct: 1,
  },
  {
    key: "E",
    title: "Enthusiasm – Entusiasmo",
    icon: Sparkles,
    color: "from-amber-50 to-amber-100",
    question:
      "¿Qué hace un líder entusiasta para inspirar a su equipo en Rancho Santa Marina?",
    options: [
      "Motiva con energía positiva y comparte el propósito del rancho.",
      "Se enfoca solo en sus propias tareas.",
      "Exige resultados sin explicar el porqué del trabajo.",
    ],
    correct: 0,
  },
  {
    key: "L1",
    title: "Love – Amor y Cuidado",
    icon: Heart,
    color: "from-rose-50 to-rose-100",
    question:
      "¿Cómo se demuestra el liderazgo con amor en Rancho Santa Marina?",
    options: [
      "Mostrando empatía, cuidando a las personas y respetando a los animales.",
      "Corrigiendo de manera severa para que aprendan.",
      "Evitando involucrarse en problemas personales del equipo.",
    ],
    correct: 0,
  },
  {
    key: "F",
    title: "Flexibility – Flexibilidad",
    icon: RefreshCw,
    color: "from-blue-50 to-blue-100",
    question:
      "Cuando falta un ingrediente o cambia el clima, ¿qué hace un líder flexible?",
    options: [
      "Busca soluciones creativas junto al equipo y se adapta a la situación.",
      "Se queja del problema.",
      "Espera que la dirección lo resuelva todo.",
    ],
    correct: 0,
  },
  {
    key: "L2",
    title: "Long-term Vision – Largo Plazo",
    icon: Compass,
    color: "from-green-50 to-green-100",
    question: "Pensar a largo plazo en Rancho Santa Marina significa…",
    options: [
      "Cuidar las decisiones actuales para proteger el entorno y las generaciones futuras.",
      "Solo enfocarse en cumplir las metas mensuales.",
      "Priorizar la rapidez por encima de la calidad.",
    ],
    correct: 0,
  },
  {
    key: "E2",
    title: "Emotional Intelligence – Inteligencia Emocional",
    icon: Eye,
    color: "from-purple-50 to-purple-100",
    question: "¿Cómo actúa un líder emocionalmente inteligente?",
    options: [
      "Controla sus emociones y escucha activamente a los demás.",
      "Se guarda sus emociones sin comunicarlas nunca.",
      "Ignora los sentimientos de los colaboradores.",
    ],
    correct: 0,
  },
  {
    key: "S2",
    title: "Systems Thinking – Pensamiento Sistémico",
    icon: Share2,
    color: "from-teal-50 to-teal-100",
    question: "Pensar en sistema dentro del rancho significa…",
    options: [
      "Entender cómo cada área (campo, cocina, tienda) influye en las demás.",
      "Enfocarse únicamente en las propias tareas.",
      "Criticar los errores de otras áreas.",
    ],
    correct: 0,
  },
  {
    key: "S3",
    title: "Spiritual Purpose – Propósito",
    icon: Brain,
    color: "from-pink-50 to-pink-100",
    question: "Un liderazgo con propósito en Rancho Santa Marina busca…",
    options: [
      "Equilibrar bienestar, sostenibilidad y desarrollo humano.",
      "Conseguir resultados sin importar el proceso.",
      "Competir internamente para destacar individualmente.",
    ],
    correct: 0,
  },
];

/** ================= Lógica del tablero estilo Monopoly ================= */
const BOARD_SIDE = 6; // 6x6
const BOARD_SIZE = BOARD_SIDE * 4 - 4; // perímetro: 20 casillas (índices 0..19)

// Mapea índice de camino 0..19 -> {row, col} en una grilla 6x6
function indexToCell(idx: number) {
  const n = BOARD_SIDE - 1; // 5
  if (idx <= n) return { r: BOARD_SIDE - 1, c: BOARD_SIDE - 1 - idx }; // abajo (derecha->izq)
  if (idx <= n + n) return { r: BOARD_SIDE - 1 - (idx - n), c: 0 }; // izquierda (abajo->arriba)
  if (idx <= n + n + n) return { r: 0, c: idx - 2 * n }; // arriba (izq->der)
  // derecha (arriba->abajo)
  return { r: idx - 3 * n, c: BOARD_SIDE - 1 };
}

// Pequeñas etiquetas para algunas casillas (opcional, solo visual)
const CORNERS: Record<number, string> = {
  0: "SALIDA",
  [BOARD_SIDE - 1]: "🎲",
  [BOARD_SIDE - 1 + (BOARD_SIDE - 1)]: "☀️",
  [3 * (BOARD_SIDE - 1)]: "🏡",
};

/** ================= Componente principal ================= */
export default function MonopolyLeadershipGame() {
  const [skin, setSkin] = useState<Skin>(SKINS.ranch);
  const [players, setPlayers] = useState<Player[]>([]);
  const [turnIdx, setTurnIdx] = useState<number>(0);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);
  const [needsQuestion, setNeedsQuestion] = useState<boolean>(false);
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
  const [prevPosBeforeRoll, setPrevPosBeforeRoll] = useState<number | null>(
    null
  );
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [rolling, setRolling] = useState<boolean>(false);

  // feedback modal (correcto/incorrecto)
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  const stage = STAGES[questionIdx % STAGES.length];
  const currentPlayer = players[turnIdx] as Player | undefined;

  const addPlayer = (name: string, iconKey: string | null) => {
    if (!name || !iconKey || players.length >= MAX_PLAYERS || gameStarted)
      return;
    setPlayers((prev) => [...prev, { name, iconKey, position: 0, laps: 0 }]);
  };

  const nextQuestion = () =>
    setQuestionIdx((i) => (i + 1) % (STAGES.length === 0 ? 1 : STAGES.length));

  const startGame = () => {
    if (players.length === 0) return;
    setGameStarted(true);
  };

  const rollDice = () => {
    if (!currentPlayer || needsQuestion || winnerIdx !== null || rolling)
      return;

    setRolling(true);
    setCurrentRoll(null); // limpia el número mientras gira

    const finalRoll = Math.floor(Math.random() * 6) + 1; // resultado 1–6

    // Simula el giro del dado (~900ms)
    setTimeout(() => {
      setCurrentRoll(finalRoll); // muestra el número obtenido
      setPrevPosBeforeRoll(currentPlayer.position);

      // Espera un poco antes de mostrar la pregunta (para que el jugador vea el número)
      setTimeout(() => {
        setPlayers((prev) => {
          const arr = [...prev];
          const p = { ...arr[turnIdx] };
          const oldPos = p.position;
          const newPos = (oldPos + finalRoll) % BOARD_SIZE;

          // ¿Completó vuelta?
          if (oldPos + finalRoll >= BOARD_SIZE) {
            p.laps += 1;
          }

          p.position = newPos;
          arr[turnIdx] = p;

          // Si gana, muestra la pantalla final
          if (p.laps >= 1) {
            setWinnerIdx(turnIdx);
            setNeedsQuestion(false);
            setShowFeedback(true);
            setWasCorrect(true);
          } else {
            // ahora sí mostramos la pregunta, con pequeño retraso
            setNeedsQuestion(true);
          }
          return arr;
        });

        setRolling(false);
      }, 100); // 100ms después de mostrar el número
    }, 900);
  };

  // Procesa respuesta y muestra feedback
  const handleAnswer = () => {
    if (selected === null || !currentPlayer || currentRoll == null) return;
    const correct = selected === stage.correct;
    setWasCorrect(correct);
    setShowFeedback(true);

    if (!correct) {
      // regresar a donde estaba antes de tirar
      if (prevPosBeforeRoll !== null) {
        setPlayers((prev) => {
          const arr = [...prev];
          const p = { ...arr[turnIdx] };
          const justPassed = prevPosBeforeRoll + currentRoll >= BOARD_SIZE;
          if (justPassed && p.laps > 0) p.laps -= 1;
          p.position = prevPosBeforeRoll;
          arr[turnIdx] = p;
          return arr;
        });
      }
    }
  };

  // Cierra feedback y avanza turno
  const closeFeedback = () => {
    setNeedsQuestion(false);
    setSelected(null);
    nextQuestion();
    setCurrentRoll(null);
    setShowFeedback(false);

    if (winnerIdx === null) {
      setTurnIdx((i) => (players.length === 0 ? 0 : (i + 1) % players.length));
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setTurnIdx(0);
    setCurrentRoll(null);
    setNeedsQuestion(false);
    setSelected(null);
    setWinnerIdx(null);
    setPrevPosBeforeRoll(null);
    setQuestionIdx(0);
    setGameStarted(false);
    setShowFeedback(false);
    setWasCorrect(null);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${skin.bg} text-black flex flex-col items-center`}
    >
      <h1 className="text-2xl font-bold mt-4">
        🎲 SELFLESS – Tablero tipo Monopoly
      </h1>
      <main className="w-full max-w-6xl p-4">
        {winnerIdx !== null ? (
          <FinishScreen
            player={players[winnerIdx]}
            onReset={resetGame}
            skin={skin}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <Lobby
                players={players}
                addPlayer={addPlayer}
                skin={skin}
                setSkin={setSkin}
                gameStarted={gameStarted}
                onStart={startGame}
              />
              <TurnPanel
                current={currentPlayer}
                turnIdx={turnIdx}
                players={players}
                rollDice={rollDice}
                currentRoll={currentRoll}
                skin={skin}
                gameStarted={gameStarted}
                rolling={rolling}
              />

              <HowTo skin={skin} />
            </div>

            <Board players={players} skin={skin} />

            {/* Modal de preguntas */}
            {needsQuestion && currentPlayer && (
              <Modal onClose={() => {}}>
                <StageCard
                  stage={stage}
                  selected={selected}
                  setSelected={(i) => setSelected(i)}
                  onSubmit={handleAnswer}
                  player={currentPlayer}
                  skin={skin}
                  diceResult={currentRoll}
                />
              </Modal>
            )}

            {/* Modal de feedback Correcto / Incorrecto */}
            {showFeedback && (
              <Modal onClose={closeFeedback}>
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-black/10 ring-1 ring-emerald-200 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Resultado</h3>
                    <button
                      onClick={closeFeedback}
                      className="p-1 rounded hover:bg-black/5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {wasCorrect ? (
                    <div className="text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">
                        ¡Correcto! Te quedas en la casilla.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          className="text-red-200"
                          strokeWidth="2"
                        ></circle>
                        <path
                          d="M15 9l-6 6M9 9l6 6"
                          className="text-red-600"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                      <p className="text-red-700 font-medium">
                        Incorrecto. Regresas a la casilla anterior.
                      </p>
                    </div>
                  )}
                  <div className="text-right mt-4">
                    <button
                      onClick={closeFeedback}
                      className={`${skin.accentBtn} px-4 py-2 rounded-xl`}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/** ================= Lobby / UI ================= */
function Lobby({
  players,
  addPlayer,
  skin,
  setSkin,
  gameStarted,
  onStart,
}: {
  players: Player[];
  addPlayer: (name: string, iconKey: string | null) => void;
  skin: Skin;
  setSkin: (s: Skin) => void;
  gameStarted: boolean;
  onStart: () => void;
}) {
  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState<string | null>(null);

  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow border ring-1 ${skin.cardRing}`}
    >
      {!gameStarted ? (
        <>
          <h2 className="font-semibold mb-2">Crear jugador</h2>
          <input
            className="border rounded w-full p-2 mb-3"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-4 gap-2 mb-3">
            {ICON_SET.map(({ key, Icon, className }) => (
              <button
                key={key}
                onClick={() => setIconKey(key)}
                className={`p-2 rounded-xl border ${
                  iconKey === key ? "ring-2 ring-emerald-400" : ""
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto ${className}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                addPlayer(name.trim(), iconKey);
                setName("");
                setIconKey(null);
              }}
              className={`${skin.accentBtn} px-3 py-2 rounded-xl`}
            >
              Agregar
            </button>
            <button
              onClick={onStart}
              className="px-3 py-2 rounded-xl border hover:bg-black/5"
              disabled={players.length === 0}
              title={
                players.length === 0
                  ? "Agrega al menos 1 jugador"
                  : "Comenzar partida"
              }
            >
              Jugar
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Jugadores</h3>
            {players.length === 0 && (
              <div className="text-sm text-black/60">Aún no hay jugadores.</div>
            )}
            {players.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex justify-between items-center border p-2 mb-1 rounded"
              >
                <div className="flex items-center gap-2">
                  <Token iconKey={p.iconKey} emoji={skin.tokenEmoji} />
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-black/50">
                    • Vueltas: {p.laps}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Tema visual</h3>
            <ThemePicker skin={skin} setSkin={setSkin} />
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold mb-2">Partida en curso</h2>
          <p className="text-sm text-black/60 mb-2">
            La creación de jugadores está bloqueada. Solo puedes cambiar el tema
            visual.
          </p>
          <div>
            {players.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex justify-between items-center border p-2 mb-1 rounded"
              >
                <div className="flex items-center gap-2">
                  <Token iconKey={p.iconKey} emoji={skin.tokenEmoji} />
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-black/50">
                    • Vueltas: {p.laps}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Tema visual</h3>
            <ThemePicker skin={skin} setSkin={setSkin} />
          </div>
        </>
      )}
    </div>
  );
}

function ThemePicker({
  skin,
  setSkin,
}: {
  skin: Skin;
  setSkin: (s: Skin) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {Object.values(SKINS).map((t) => (
        <button
          key={t.key}
          onClick={() => setSkin(t)}
          className={`border rounded-xl p-3 text-left hover:shadow ${
            skin.key === t.key ? "ring-2 ring-emerald-400" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{t.tokenEmoji}</span>
            <span className="font-medium">{t.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function TurnPanel({
  current,
  turnIdx,
  players,
  rollDice,
  currentRoll,
  skin,
  gameStarted,
  rolling,
}: {
  current?: Player;
  turnIdx: number;
  players: Player[];
  rollDice: () => void;
  currentRoll: number | null;
  skin: Skin;
  gameStarted: boolean;
  rolling: boolean;
}) {
  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow border ring-1 ${skin.cardRing}`}
    >
      <h2 className="font-semibold mb-2">Turno</h2>
      {players.length === 0 ? (
        <p className="text-sm text-black/60">Agrega jugadores para iniciar.</p>
      ) : (
        <>
          {!gameStarted && (
            <p className="text-sm text-black/60 mb-2">
              Presiona <b>Jugar</b> para bloquear jugadores y comenzar.
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-black/60">Jugador actual:</span>
            {current && (
              <>
                <Token iconKey={current.iconKey} emoji={skin.tokenEmoji} />
                <span className="font-medium">{current.name}</span>
                <span className="ml-auto text-xs text-black/50">
                  Turno #{turnIdx + 1}
                </span>
              </>
            )}
          </div>
          <button
            onClick={rollDice}
            disabled={
              !current || currentRoll !== null || !gameStarted || rolling
            }
            className={`${skin.accentBtn} px-4 py-2 rounded-xl disabled:opacity-50`}
            title={
              !gameStarted ? "Debes presionar Jugar primero" : "Lanzar el dado"
            }
          >
            {rolling
              ? "Lanzando…"
              : currentRoll === null
              ? "Lanzar dado"
              : "Esperando respuesta…"}
          </button>

          <div className="mt-3 flex items-center gap-3">
            <Dice value={currentRoll} rolling={rolling} />
            <div className="text-sm">
              {rolling && (
                <span className="text-black/60">El dado está girando…</span>
              )}
              {!rolling && currentRoll !== null && (
                <>
                  Resultado del dado:{" "}
                  <span className="font-semibold">{currentRoll}</span>
                </>
              )}
            </div>
          </div>

          <p className="mt-2 text-xs text-black/60">
            Al caer en la casilla respondes una pregunta. Si aciertas te quedas,
            si fallas regresas a la casilla anterior.
          </p>
        </>
      )}
    </div>
  );
}

function Dice({ value, rolling }: { value: number | null; rolling: boolean }) {
  // Mientras gira, mostramos caras aleatorias “rápidas”
  const [tempFace, setTempFace] = useState<number>(1);

  useEffect(() => {
    if (!rolling) return;
    const id = setInterval(() => {
      setTempFace(1 + Math.floor(Math.random() * 6));
    }, 90);
    return () => clearInterval(id);
  }, [rolling]);

  const face = rolling ? tempFace : value ?? 0;

  // Dado estilo tarjeta con rotación y pequeño “bounce”
  return (
    <motion.div
      className="w-14 h-14 grid place-items-center rounded-xl bg-white border shadow"
      animate={
        rolling
          ? {
              rotate: [0, 20, -20, 10, -10, 0],
              scale: [1, 1.05, 0.98, 1.03, 1],
            }
          : { rotate: 0, scale: 1 }
      }
      transition={
        rolling ? { duration: 0.9, ease: "easeInOut" } : { duration: 0.2 }
      }
    >
      <DiceFace n={face} />
    </motion.div>
  );
}

function DiceFace({ n }: { n: number }) {
  // Si aún no hay valor (0), mostramos un guion
  if (!n) return <span className="text-black/50 text-lg">—</span>;

  // Caras con “pips” simples en grid 3x3
  const pip = <div className="w-2 h-2 rounded-full bg-black/80" />;
  const positions: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 gap-1 w-10 h-10"
      aria-label={`Dado mostrando ${n}`}
      title={`Dado: ${n}`}
    >
      {Array.from({ length: 9 }, (_, i) => i + 1).map((idx) => (
        <div key={idx} className="grid place-items-center">
          {positions[n].includes(idx) ? pip : null}
        </div>
      ))}
    </div>
  );
}

function HowTo({ skin }: { skin: Skin }) {
  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow border ring-1 ${skin.cardRing}`}
    >
      <h2 className="font-semibold mb-2">Cómo se gana</h2>
      <ul className="text-sm list-disc pl-5 space-y-1 text-black/80">
        <li>
          Agrega jugadores y presiona <b>Jugar</b>. Después ya no podrás crear
          más.
        </li>
        <li>Lanza el dado por turnos y avanza por el perímetro.</li>
        <li>
          Responde la pregunta en el <b>pop-up</b>.
        </li>
        <li>Si fallas, retrocedes a donde estabas antes del tiro.</li>
        <li>Quien complete 1 vuelta (pase por SALIDA) gana la partida.</li>
      </ul>
    </div>
  );
}

/** ================= Board ================= */
function Board({ players, skin }: { players: Player[]; skin: Skin }) {
  // Prepara cuadrícula 6x6; las casillas del perímetro son el “camino”
  const cells = Array.from({ length: BOARD_SIDE * BOARD_SIDE }, (_, idx) => {
    const r = Math.floor(idx / BOARD_SIDE);
    const c = idx % BOARD_SIDE;
    const onPerimeter =
      r === 0 || c === 0 || r === BOARD_SIDE - 1 || c === BOARD_SIDE - 1;
    return { r, c, onPerimeter };
  });

  // Para cada índice de camino 0..19 calculamos coords
  const pathCells = Array.from({ length: BOARD_SIZE }, (_, i) =>
    indexToCell(i)
  );

  // Agrupamos tokens por casilla para mostrarlos juntos
  const tokensByCell = new Map<string, Player[]>();
  players.forEach((p) => {
    const key = String(p.position);
    const list = tokensByCell.get(key) ?? [];
    list.push(p);
    tokensByCell.set(key, list);
  });

  return (
    <div className="mt-6">
      <div className="relative">
        <div
          className={`mx-auto grid gap-1 w-[min(90vw,560px)] aspect-square`}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIDE}, minmax(0,1fr))`,
            gridTemplateRows: `repeat(${BOARD_SIDE}, minmax(0,1fr))`,
          }}
        >
          {cells.map((cell, idx) => {
            const isPath = cell.onPerimeter;
            // ¿qué índice del camino es esta celda?
            const pathIndexHere = isPath
              ? pathCells.findIndex((pc) => pc.r === cell.r && pc.c === cell.c)
              : -1;

            const label =
              isPath && pathIndexHere in CORNERS
                ? (CORNERS as any)[pathIndexHere]
                : "";

            return (
              <div
                key={idx}
                className={`relative rounded-md border ${
                  isPath
                    ? `border-amber-300 ${skin.pathBg}`
                    : "border-transparent bg-white/40"
                }`}
              >
                {isPath && (
                  <div className="absolute inset-0 p-1">
                    <div className="w-full h-full rounded-md bg-white/70 border border-white/60 backdrop-blur-[1px] grid place-items-center text-[10px] text-emerald-900">
                      {label || pathIndexHere}
                    </div>
                  </div>
                )}

                {/* Tokens que caen en esta casilla */}
                {isPath && tokensByCell.has(String(pathIndexHere)) && (
                  <div className="absolute -top-3 -right-1 flex flex-wrap gap-1">
                    {tokensByCell.get(String(pathIndexHere))!.map((p, i) => (
                      <Token
                        key={p.name + i}
                        iconKey={p.iconKey}
                        emoji=" "
                        size={14}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-black/60">
        Perímetro: {BOARD_SIZE} casillas • 0 = SALIDA
      </div>
    </div>
  );
}

/** ================= Modal / Pop-up ================= */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 max-w-xl w-[92vw]"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** ================= Carta de Pregunta ================= */
function StageCard({
  stage,
  selected,
  setSelected,
  onSubmit,
  player,
  skin,
  diceResult,
}: {
  stage: Stage;
  selected: number | null;
  setSelected: (i: number) => void;
  onSubmit: () => void;
  player: Player;
  skin: Skin;
  diceResult: number | null;
}) {
  const StageIcon = stage.icon;
  return (
    <div
      className={`bg-white rounded-3xl shadow-lg p-6 border border-black/10 ring-1 ${skin.cardRing}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <StageIcon className={`w-6 h-6 ${skin.stationIcon}`} />
        <h2 className="text-xl font-semibold">{stage.title}</h2>
      </div>
      <div className="flex items-center gap-3 mb-3 text-sm">
        <span className="text-black/60">Jugador:</span>
        <Token iconKey={player.iconKey} emoji={skin.tokenEmoji} />
        <span className="font-medium">{player.name}</span>
        <span className="ml-auto text-black/60">
          Posición: {player.position} • 🎲 Dado: {diceResult ?? "—"}
        </span>
      </div>

      <p className="mb-4 text-black/80">{stage.question}</p>
      {stage.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={`w-full text-left border p-3 rounded-xl mb-2 ${
            selected === i
              ? "bg-emerald-100 border-emerald-400"
              : "hover:bg-emerald-50"
          }`}
        >
          {opt}
        </button>
      ))}
      <div className="text-right mt-3">
        <button
          onClick={onSubmit}
          className={`${skin.accentBtn} px-4 py-2 rounded-xl`}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

/** ================= Pantalla de Ganador ================= */
function FinishScreen({
  player,
  onReset,
  skin,
}: {
  player: Player;
  onReset: () => void;
  skin: Skin;
}) {
  return (
    <div className="relative mt-6">
      <MetaBanner />
      <Confetti palette={skin.confetti} />
      <div
        className={`text-center bg-white p-8 rounded-3xl shadow border mt-2 ring-1 ${skin.cardRing}`}
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-green-800">¡GANASTE!</h2>
        <p className="text-black/70 mb-4">
          Felicidades {player.name}, diste la vuelta al tablero 🎉
        </p>
        <button
          onClick={onReset}
          className={`px-4 py-2 rounded-xl ${skin.accentBtn}`}
        >
          Nueva partida
        </button>
      </div>
    </div>
  );
}

/** ================= Utilitarios visuales ================= */
function Token({
  iconKey,
  emoji,
  size = 16,
}: {
  iconKey: string;
  emoji: string;
  size?: number;
}) {
  const icon = ICON_SET.find((i) => i.key === iconKey) ?? ICON_SET[0];
  const Ico = icon.Icon;
  return (
    <div className="relative">
      {emoji?.trim() && (
        <div className="absolute -top-3 -right-3 text-lg select-none">
          {emoji}
        </div>
      )}
      <div className="w-7 h-7 grid place-items-center rounded-full bg-white border border-emerald-200">
        <Ico size={size} className={icon.className} />
      </div>
    </div>
  );
}

function MetaBanner() {
  return (
    <div className="relative mx-auto mb-4 w-full max-w-xl h-24">
      <div className="absolute left-6 bottom-0 w-3 h-24 bg-amber-800 rounded"></div>
      <div className="absolute right-6 bottom-0 w-3 h-24 bg-amber-800 rounded"></div>
      <div className="absolute left-6 right-6 top-3 h-10 bg-red-500/90 rounded-md border-2 border-red-700 grid place-items-center shadow">
        <span className="text-white font-bold tracking-widest">META</span>
      </div>
      <div className="absolute left-6 right-6 top-[52px] h-[2px] bg-amber-900"></div>
    </div>
  );
}

function Confetti({ palette }: { palette: string[] }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 1,
        color: palette[Math.floor(Math.random() * palette.length)],
      })),
    [palette]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "100vh", rotate: 720, opacity: 0 }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
          className="absolute w-2 h-3 rounded"
          style={{ left: `${p.left}%`, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
