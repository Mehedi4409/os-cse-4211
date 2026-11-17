import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  ArrowLeftRight, 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

// ==========================================
// 1. CENTRALIZED DATA STORE (JSON / Objects / Arrays)
// ==========================================
const CRYPTO_DATA = {
  meta: {
    title: "Cryptography vs. Cryptanalysis",
    subtitle: "Explore the eternal cat-and-mouse game between code-makers and code-breakers.",
    tabs: [
      { id: 'overview', label: '1. Core Concepts' },
      { id: 'relationship', label: '2. How They Relate' },
      { id: 'differences', label: '3. Key Differences' },
      { id: 'lab', label: '4. Interactive Lab' }
    ]
  },
  concepts: [
    {
      id: 'cryptography',
      title: 'Cryptography',
      role: 'The Code-Makers (Defense)',
      icon: 'Shield',
      color: 'emerald',
      definition: 'The practice and study of techniques for secure communication in the presence of adversarial behavior.',
      goal: 'To protect data confidentiality, integrity, authentication, and non-repudiation.',
      keyTechniques: [
        'Symmetric Encryption (AES, ChaCha20)',
        'Asymmetric Encryption (RSA, ECC)',
        'Cryptographic Hashing (SHA-256)',
        'Digital Signatures'
      ],
      analogy: 'Designing and building an unbreakable bank vault with a complex combination lock.'
    },
    {
      id: 'cryptanalysis',
      title: 'Cryptanalysis',
      role: 'The Code-Breakers (Offense/Audit)',
      icon: 'Search',
      color: 'rose',
      definition: 'The study of analyzing information systems to study the hidden aspects of the systems and breach cryptographic security.',
      goal: 'To find weaknesses or flaws in cryptographic algorithms to recover plaintext without the key.',
      keyTechniques: [
        'Brute-Force Attacks',
        'Frequency Analysis',
        'Differential & Linear Cryptanalysis',
        'Side-Channel Attacks (Timing/Power)'
      ],
      analogy: 'A locksmith or thief listening to the clicks of the vault dial to crack it open without the combination.'
    }
  ],
  relationship: {
    umbrellaTerm: 'Cryptology',
    description: 'Together, Cryptography and Cryptanalysis form the science of Cryptology. They exist in a symbiotic, evolutionary loop: cryptanalysis exposes flaws, forcing cryptography to evolve stronger defenses.',
    cycleSteps: [
      {
        step: 1,
        actor: 'Cryptographer',
        action: 'Creates a new cipher (e.g., DES or Enigma) to secure messages.',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      },
      {
        step: 2,
        actor: 'Cryptanalyst',
        action: 'Studies the math and implementation to find patterns, leaks, or shortcuts.',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      },
      {
        step: 3,
        actor: 'Vulnerability Found',
        action: 'A weakness is discovered (e.g., key size too small or predictable patterns).',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      },
      {
        step: 4,
        actor: 'Cryptographer',
        action: 'Upgrades the standard (e.g., migrating from DES to AES-256) to patch the flaw.',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      }
    ]
  },
  comparisons: [
    {
      aspect: 'Primary Objective',
      cryptography: 'Secure data and prevent unauthorized access.',
      cryptanalysis: 'Bypass security and uncover hidden data without the key.'
    },
    {
      aspect: 'Mindset / Role',
      cryptography: 'Builder / Architect / Defender',
      cryptanalysis: 'Breaker / Auditor / Attacker'
    },
    {
      aspect: 'Inputs & Outputs',
      cryptography: 'Takes Plaintext + Key → Produces Ciphertext.',
      cryptanalysis: 'Takes Ciphertext (+ partial context) → Recovers Plaintext or Key.'
    },
    {
      aspect: 'Core Disciplines',
      cryptography: 'Number theory, algebra, computer science, protocol design.',
      cryptanalysis: 'Statistics, probability, pattern recognition, hardware physics.'
    },
    {
      aspect: 'Success Metric',
      cryptography: 'No known attack is faster than brute-forcing the entire keyspace.',
      cryptanalysis: 'Finding a shortcut that breaks the cipher faster than brute force.'
    }
  ],
  labScenarios: [
    {
      id: 'caesar',
      name: 'Weak Cipher: Caesar Shift (+3)',
      plaintext: 'ATTACK AT DAWN',
      ciphertext: 'DWWDFN DW GDZQ',
      key: 'Shift = 3',
      hint: 'Notice how "TT" becomes "WW" and "A" becomes "D". Letter frequencies are preserved!',
      analysisResult: 'BROKEN! Frequency analysis reveals "W" appears most often (mapping to "T"), exposing the shift of +3 in milliseconds.'
    },
    {
      id: 'aes',
      name: 'Modern Cipher: AES-256',
      plaintext: 'ATTACK AT DAWN',
      ciphertext: '9f86d081884c7d659a2feaa0c55ad015',
      key: '256-bit Secret Key',
      hint: 'Output looks completely random (high entropy). Repeated letters ("TT") produce totally different hex values.',
      analysisResult: 'SECURE! No statistical patterns found. Brute-forcing 2^256 combinations would take longer than the age of the universe.'
    }
  ]
};

// Helper for dynamic icons
const IconRenderer = ({ name, className }) => {
  const icons = { Shield, Search };
  const Component = icons[name] || Shield;
  return <Component className={className} />;
};

// ==========================================
// 2. SINGLE RESPONSIBILITY SUB-COMPONENTS
// ==========================================

/**
 * SRP: Renders the header and navigation tabs
 */
const NavigationHeader = ({ meta, activeTab, setActiveTab }) => (
  <header className="mb-8 border-b border-slate-800 pb-6">
    <div className="flex items-center gap-3 mb-2">
      <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        Cryptology Interactive Module
      </span>
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
      {meta.title}
    </h1>
    <p className="text-slate-400 mt-2 text-base md:text-lg max-w-2xl">
      {meta.subtitle}
    </p>

    {/* Navigation Pills */}
    <nav className="flex flex-wrap gap-2 mt-6">
      {meta.tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/25"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  </header>
);

/**
 * SRP: Renders an individual discipline card (Cryptography OR Cryptanalysis)
 */
const ConceptCard = ({ concept }) => {
  const isEmerald = concept.color === 'emerald';
  const borderClass = isEmerald ? 'border-emerald-500/30' : 'border-rose-500/30';
  const badgeClass = isEmerald 
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
    : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  const iconBg = isEmerald ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-slate-900/90 border ${borderClass} rounded-2xl p-6 flex flex-col justify-between shadow-xl`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <IconRenderer name={concept.icon} className="w-6 h-6" />
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${badgeClass}`}>
            {concept.role}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{concept.title}</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {concept.definition}
        </p>

        <div className="bg-slate-950/60 rounded-xl p-4 mb-4 border border-slate-800/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Primary Goal
          </h3>
          <p className="text-sm text-slate-200">{concept.goal}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Core Techniques
          </h3>
          <ul className="space-y-1.5">
            {concept.keyTechniques.map((tech, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isEmerald ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <p className="text-xs text-slate-400 italic">
          <strong className="text-slate-300 not-italic">Real-world Analogy: </strong>
          {concept.analogy}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * SRP: Visualizes how both fields merge into Cryptology and drive each other forward
 */
const RelationshipVisualizer = ({ relationship }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-6">
      {/* Umbrella Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-sm border border-indigo-500/30 mb-3">
          Parent Discipline: {relationship.umbrellaTerm}
        </span>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {relationship.description}
        </p>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" /> Cryptography (Builds)
          </div>
          <ArrowLeftRight className="w-6 h-6 text-indigo-400 rotate-90 md:rotate-0" />
          <div className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-2">
            <Search className="w-5 h-5" /> Cryptanalysis (Tests & Breaks)
          </div>
        </div>
      </div>

      {/* Interactive Evolutionary Loop */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">The Evolutionary Security Loop</h3>
          <span className="text-xs text-slate-400">Click any step to inspect</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {relationship.cycleSteps.map((item, idx) => {
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={item.step}
                onClick={() => setActiveStep(idx)}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer rounded-xl p-4 border transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">STEP 0{item.step}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.actor}
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-snug">{item.action}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * SRP: Renders a structured side-by-side comparison table
 */
const ComparisonMatrix = ({ comparisons }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-950/80 border-b border-slate-800">
            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-1/4">
              Feature / Dimension
            </th>
            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-emerald-400 w-3/8">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> Cryptography
              </div>
            </th>
            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-rose-400 w-3/8">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Cryptanalysis
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {comparisons.map((row, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="hover:bg-slate-800/40 transition-colors"
            >
              <td className="p-4 font-semibold text-sm text-white">{row.aspect}</td>
              <td className="p-4 text-sm text-slate-300">{row.cryptography}</td>
              <td className="p-4 text-sm text-slate-300">{row.cryptanalysis}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * SRP: Interactive simulation allowing students to act as Cryptographer & Cryptanalyst
 */
const InteractiveLab = ({ scenarios }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const currentScenario = scenarios[selectedIdx];

  const handleScenarioChange = (idx) => {
    setSelectedIdx(idx);
    setIsEncrypted(false);
    setIsAnalyzed(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Hands-On Cipher Sandbox</h3>
          <p className="text-sm text-slate-400">
            Step 1: Encrypt a message as a Cryptographer. Step 2: Attack it as a Cryptanalyst.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex gap-2">
          {scenarios.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => handleScenarioChange(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedIdx === idx
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {scen.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cryptographer Station */}
        <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> 1. Cryptographer View
            </span>
            <span className="text-xs text-slate-500 font-mono">{currentScenario.key}</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Original Plaintext:</label>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-white">
              {currentScenario.plaintext}
            </div>
          </div>

          <button
            onClick={() => {
              setIsEncrypted(true);
              setIsAnalyzed(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" /> Apply Encryption
          </button>

          {isEncrypted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="text-xs text-emerald-400 block mb-1">Transmitted Ciphertext:</label>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 font-mono text-sm text-emerald-300 break-all">
                {currentScenario.ciphertext}
              </div>
            </motion.div>
          )}
        </div>

        {/* Cryptanalyst Station */}
        <div className="bg-slate-950/70 border border-rose-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> 2. Cryptanalyst View
            </span>
            <span className="text-xs text-slate-500">No Key Available</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Intercepted Traffic:</label>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-slate-300 break-all">
              {isEncrypted ? currentScenario.ciphertext : 'Waiting for encrypted transmission...'}
            </div>
          </div>

          <button
            disabled={!isEncrypted}
            onClick={() => setIsAnalyzed(true)}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              isEncrypted
                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Cpu className="w-4 h-4" /> Run Cryptanalysis Attack
          </button>

          {isAnalyzed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 pt-1"
            >
              <p className="text-xs text-slate-400">
                <strong className="text-slate-200">Observation:</strong> {currentScenario.hint}
              </p>
              <div
                className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                  currentScenario.id === 'caesar'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                }`}
              >
                {currentScenario.id === 'caesar' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span>{currentScenario.analysisResult}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN ORCHESTRATOR COMPONENT
// ==========================================
const Cryptography_VS_cryptonalysis = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <NavigationHeader
          meta={CRYPTO_DATA.meta}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CRYPTO_DATA.concepts.map((concept) => (
                    <ConceptCard key={concept.id} concept={concept} />
                  ))}
                </div>
              )}

              {activeTab === 'relationship' && (
                <RelationshipVisualizer relationship={CRYPTO_DATA.relationship} />
              )}

              {activeTab === 'differences' && (
                <ComparisonMatrix comparisons={CRYPTO_DATA.comparisons} />
              )}

              {activeTab === 'lab' && (
                <InteractiveLab scenarios={CRYPTO_DATA.labScenarios} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Cryptography_VS_cryptonalysis;