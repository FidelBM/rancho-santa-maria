"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  Brain,
  Compass,
  Leaf,
  Sparkles,
  RefreshCw,
  Share2,
  Eye,
  Sun,
  Star,
  PawPrint,
  LucideIcon,
} from "lucide-react";

/** ========= Config General ========= */
const MAX_PLAYERS = 10;
const INITIAL_LIVES = 3;

/** ========= Tipos ========= */
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
  position: number; // 0..STAGES.length
  lives: number;
};

type Stage = {
  key: string;
  display: string; // letra en el tablero
  title: string;
  icon: LucideIcon;
  color: string; // gradiente tailwind
  question: string;
  options: string[];
  correct: number; // índice de la correcta
};

/** ========= Skins ========= */
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

/** ========= Íconos disponibles para jugadores ========= */
const ICON_SET: { key: string; Icon: LucideIcon; className: string }[] = [
  { key: "sun", Icon: Sun, className: "text-amber-600" },
  { key: "star", Icon: Star, className: "text-yellow-500" },
  { key: "leaf", Icon: Leaf, className: "text-emerald-600" },
  { key: "spark", Icon: Sparkles, className: "text-fuchsia-500" },
  { key: "paw", Icon: PawPrint, className: "text-stone-700" },
  { key: "eye", Icon: Eye, className: "text-purple-700" },
  { key: "heart", Icon: Heart, className: "text-rose-600" },
  { key: "compass", Icon: Compass, className: "text-teal-700" },
];

/** ========= Etapas SELFLESS ========= */
const STAGES: Stage[] = [
  {
    key: "S",
    display: "S",
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
    display: "E",
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
    display: "L",
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
    display: "F",
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
    display: "L",
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
    display: "E",
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
    display: "S",
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
    display: "S",
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

/** ========= Página principal ========= */
export default function Page() {
  const [skin, setSkin] = useState<Skin>(SKINS.ranch);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFinish, setShowFinish] = useState<boolean>(false);
  const [outOfLives, setOutOfLives] = useState<boolean>(false);

  const stage = STAGES[stageIndex] ?? STAGES[STAGES.length - 1];

  const addPlayer = (name: string, iconKey: string | null) => {
    if (!name || !iconKey || players.length >= MAX_PLAYERS) return;
    setPlayers((prev) => [
      ...prev,
      { name, iconKey, position: 0, lives: INITIAL_LIVES },
    ]);
  };

  const startFor = (idx: number) => {
    setCurrentIdx(idx);
    setStageIndex(players[idx]?.position ?? 0);
    setShowFinish(false);
    setOutOfLives(false);
    setSelected(null);
  };

  const handleAnswer = () => {
    if (selected === null) {
      window.alert("Selecciona una respuesta.");
      return;
    }
    const correct = selected === stage.correct;

    if (currentIdx === null) return;

    if (correct) {
      const advanced = players.map((p, i) =>
        i === currentIdx ? { ...p, position: p.position + 1 } : p
      );
      setPlayers(advanced);
      setSelected(null);
      if (stageIndex + 1 >= STAGES.length) setShowFinish(true);
      else setStageIndex(stageIndex + 1);
    } else {
      const updated = players.map((p, i) =>
        i === currentIdx ? { ...p, lives: p.lives - 1 } : p
      );
      setPlayers(updated);
      setSelected(null);
      const livesLeft = updated[currentIdx]?.lives ?? 0;
      if (livesLeft <= 0) {
        setOutOfLives(true);
      } else {
        window.alert(`Respuesta incorrecta. Te quedan ${livesLeft} vidas.`);
      }
    }
  };

  const backToLobby = () => {
    setCurrentIdx(null);
    setSelected(null);
    setOutOfLives(false);
    setShowFinish(false);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${skin.bg} text-black flex flex-col items-center`}
    >
      <h1 className="text-2xl font-bold mt-4">
        🌿 Caminata SELFLESS – Rancho Santa Marina
      </h1>

      <main className="w-full max-w-5xl p-4">
        {currentIdx === null ? (
          <Lobby
            players={players}
            addPlayer={addPlayer}
            startFor={startFor}
            skin={skin}
            setSkin={setSkin}
          />
        ) : outOfLives ? (
          <OutOfLivesScreen
            player={players[currentIdx]}
            onBack={backToLobby}
            skin={skin}
          />
        ) : !showFinish ? (
          <>
            <Board
              players={players}
              stageIndex={stageIndex}
              stages={STAGES}
              skin={skin}
              currentIdx={currentIdx}
            />
            <StageCard
              stage={stage}
              selected={selected}
              setSelected={setSelected}
              onSubmit={handleAnswer}
              player={players[currentIdx]}
              stageIndex={stageIndex}
              skin={skin}
            />
          </>
        ) : (
          <FinishScreen
            player={players[currentIdx]}
            onReset={backToLobby}
            skin={skin}
          />
        )}
      </main>
    </div>
  );
}

/** ========= Lobby ========= */
function Lobby({
  players,
  addPlayer,
  startFor,
  skin,
  setSkin,
}: {
  players: Player[];
  addPlayer: (name: string, iconKey: string | null) => void;
  startFor: (idx: number) => void;
  skin: Skin;
  setSkin: (s: Skin) => void;
}) {
  const [name, setName] = useState<string>("");
  const [iconKey, setIconKey] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Creador de jugador */}
      <div
        className={`bg-white p-5 rounded-2xl shadow border ring-1 ${skin.cardRing}`}
      >
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
              aria-label={`Elegir icono ${key}`}
            >
              <Icon className={`w-6 h-6 mx-auto ${className}`} />
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            addPlayer(name, iconKey);
            setName("");
            setIconKey(null);
          }}
          className={`${skin.accentBtn} px-3 py-2 rounded-xl`}
        >
          Agregar
        </button>
      </div>

      {/* Lista de jugadores */}
      <div
        className={`bg-white p-5 rounded-2xl shadow border ring-1 ${skin.cardRing}`}
      >
        <h2 className="font-semibold mb-2">Jugadores</h2>
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
              <Lives lives={p.lives} />
            </div>
            <button
              onClick={() => startFor(i)}
              className="text-emerald-700 underline text-sm"
            >
              Jugar
            </button>
          </div>
        ))}
      </div>

      {/* Selector de skin */}
      <div
        className={`bg-white p-5 rounded-2xl shadow border ring-1 ${skin.cardRing}`}
      >
        <h2 className="font-semibold mb-2">Tema visual</h2>
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
      </div>
    </div>
  );
}

/** ========= Tarjeta de pregunta ========= */
function StageCard({
  stage,
  selected,
  setSelected,
  onSubmit,
  player,
  stageIndex,
  skin,
}: {
  stage: Stage;
  selected: number | null;
  setSelected: (i: number | null) => void;
  onSubmit: () => void;
  player: Player;
  stageIndex: number;
  skin: Skin;
}) {
  const StageIcon = stage.icon;
  return (
    <div
      className={`bg-white rounded-3xl shadow-lg p-6 mt-6 border border-black/10 ring-1 ${skin.cardRing}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 grid place-items-center rounded-full bg-gradient-to-b ${stage.color} border`}
        >
          <span className="font-bold">{stage.display}</span>
        </div>
        <StageIcon className={`w-6 h-6 ${skin.stationIcon}`} />
        <h2 className="text-xl font-semibold">{stage.title}</h2>
      </div>
      <div className="flex items-center gap-3 mb-3 text-sm">
        <span className="text-black/60">Jugador:</span>
        <Token iconKey={player.iconKey} emoji="🎲" />
        <span className="font-medium">{player.name}</span>
        <Lives lives={player.lives} />
        <span className="ml-auto text-black/60">
          Estación {stageIndex + 1} / {STAGES.length}
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

/** ========= Pantallas de fin / sin vidas ========= */
function OutOfLivesScreen({
  player,
  onBack,
  skin,
}: {
  player: Player;
  onBack: () => void;
  skin: Skin;
}) {
  return (
    <div
      className={`text-center bg-white p-8 rounded-3xl shadow mt-8 border ring-1 ${skin.cardRing}`}
    >
      <h2 className="text-2xl font-bold text-rose-700 mb-2">Sin vidas 😵</h2>
      <p className="text-black/70 mb-4">
        {player.name}, has perdido tus 3 oportunidades. ¡Inténtalo de nuevo
        desde el lobby!
      </p>
      <button
        onClick={onBack}
        className={`px-4 py-2 rounded-xl ${skin.accentBtn}`}
      >
        Volver al lobby
      </button>
    </div>
  );
}

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
        <h2 className="text-2xl font-bold text-green-800">¡META!</h2>
        <p className="text-black/70 mb-4">
          Felicidades {player.name}, completaste la Caminata SELFLESS 🌿
        </p>
        <button
          onClick={onReset}
          className={`px-4 py-2 rounded-xl ${skin.accentBtn}`}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

/** ========= Tablero ========= */
function Board({
  players,
  stageIndex,
  stages,
  skin,
  currentIdx,
}: {
  players: Player[];
  stageIndex: number;
  stages: Stage[];
  skin: Skin;
  currentIdx: number;
}) {
  const currentPlayer = players[currentIdx];
  const progress = Math.min(currentPlayer?.position ?? 0, stages.length);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-black/60">Progreso:</span>
        <span className="text-sm font-medium">
          {progress}/{stages.length} casillas
        </span>
      </div>

      {/* Contenedor del tablero */}
      <div
        className={`relative w-full rounded-3xl border bg-white p-3 ring-1 ${skin.cardRing}`}
      >
        {/* Camino de fondo */}
        <div
          className={`absolute inset-x-6 top-1/2 -translate-y-1/2 h-5 rounded-full ${skin.pathBg} border shadow-inner`}
        ></div>

        {/* Casillas */}
        <div className="relative grid grid-cols-8 gap-2">
          {stages.map((s, i) => {
            const active = i === stageIndex; // casilla actual
            const passed = i < progress; // superadas
            return (
              <div key={s.key} className="relative">
                <div
                  className={`aspect-square rounded-2xl border grid place-items-center text-lg font-bold transition-all duration-200 shadow-sm bg-gradient-to-b ${
                    active
                      ? `${s.color} border-emerald-400 scale-[1.03]`
                      : passed
                      ? "from-white to-emerald-50 border-emerald-300"
                      : "from-white to-slate-50 border-slate-200"
                  }`}
                >
                  {s.display}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-black/60">
                  {s.title.split(" – ")[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fichas de jugadores */}
        {players.map((p, idx) => {
          const pos = Math.min(p.position, stages.length - 1);
          const leftPct = pos * 12.5 + 6.25; // 8 columnas => 12.5% c/u, centrado
          return (
            <motion.div
              key={`${p.name}-${idx}`}
              className="absolute -top-6 flex flex-col items-center"
              animate={{ left: `${leftPct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <Token iconKey={p.iconKey} emoji={skin.tokenEmoji} />
              <span className="text-[10px] bg-white px-2 mt-1 rounded-full border text-emerald-800 shadow-sm">
                {p.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** ========= UI helpers ========= */
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
      <div className="absolute -top-3 -right-3 text-lg select-none">
        {emoji}
      </div>
      <div className="w-7 h-7 grid place-items-center rounded-full bg-white border border-emerald-200">
        <Ico className={`w-[${size}px] h-[${size}px] ${icon.className}`} />
      </div>
    </div>
  );
}

function Lives({ lives }: { lives: number }) {
  return (
    <div className="flex items-center gap-1 ml-2">
      {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
        <Heart
          key={i}
          className={`w-4 h-4 ${i < lives ? "text-rose-600" : "text-black/20"}`}
          fill={i < lives ? "#e11d48" : "transparent"}
        />
      ))}
    </div>
  );
}

function MetaBanner() {
  return (
    <div className="relative mx-auto mb-4 w-full max-w-xl h-24">
      <div className="absolute left-6 bottom-0 w-3 h-24 bg-amber-800 rounded" />
      <div className="absolute right-6 bottom-0 w-3 h-24 bg-amber-800 rounded" />
      <div className="absolute left-6 right-6 top-3 h-10 bg-red-500/90 rounded-md border-2 border-red-700 grid place-items-center shadow">
        <span className="text-white font-bold tracking-widest">META</span>
      </div>
      <div className="absolute left-6 right-6 top-[52px] h-[2px] bg-amber-900" />
    </div>
  );
}

function Confetti({ palette }: { palette: string[] }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: "100vh", rotate: 720, opacity: 0 }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 1,
          }}
          className="absolute w-2 h-3 rounded"
          style={{
            left: `${p.left}%`,
            backgroundColor:
              palette[Math.floor(Math.random() * palette.length)],
          }}
        />
      ))}
    </div>
  );
}
