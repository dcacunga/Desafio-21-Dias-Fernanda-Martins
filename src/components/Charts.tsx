import { calculateActivityData, calculatePlanPoints } from '../quizLogic';

interface ActivityChartProps {
  activity?: string;
}

export function ActivityChart({ activity }: ActivityChartProps) {
  const { x, y, label, heading, note } = calculateActivityData(activity);

  return (
    <>
      <div className="readiness-note">
        <strong>{heading}</strong>
        <p>{note}</p>
      </div>
      <div className="profile-chart">
        <h3>O teu nível de actividade informado</h3>
        <svg
          viewBox="0 0 420 270"
          role="img"
          aria-label={`Actividade informada: ${activity || 'Ainda não tenho uma rotina'}`}
        >
          <defs>
            <linearGradient id="profile-colors">
              <stop stopColor="#36bba8" />
              <stop offset=".45" stopColor="#e1ce33" />
              <stop offset=".7" stopColor="#f59b20" />
              <stop offset="1" stopColor="#ed604f" />
            </linearGradient>
          </defs>
          <path
            d="M32 30H388M32 74H388M32 118H388M32 162H388M32 206H388M32 30V206M121 30V206M210 30V206M299 30V206M388 30V206"
            fill="none"
            stroke="#c9c9c9"
            strokeDasharray="3 3"
          />
          <path
            d="M32 199C110 196 130 158 213 111S310 35 388 30V206H32Z"
            fill="url(#profile-colors)"
            opacity=".62"
          />
          <path
            d="M32 199C110 196 130 158 213 111S310 35 388 30"
            fill="none"
            stroke="url(#profile-colors)"
            strokeWidth="4"
          />
          {[
            [32, 199],
            [117, 174],
            [213, 111],
            [307, 49],
            [388, 30],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="#aaa" strokeWidth="2" />
          ))}
          <circle cx={x} cy={y} r="6" fill="white" stroke="#ec4899" strokeWidth="3" />
          <rect
            x={Math.max(25, x - 23)}
            y={Math.max(0, y - 40)}
            width="56"
            height="25"
            rx="12"
            fill="#ec4899"
          />
          <text
            x={Math.max(53, x + 5)}
            y={Math.max(17, y - 23)}
            textAnchor="middle"
            fill="white"
            fontWeight="bold"
            fontSize="12"
          >
            Tu
          </text>
          <text x="32" y="232" textAnchor="start" fontSize="13" fill="#666">
            Sem rotina
          </text>
          <text x="150" y="232" textAnchor="middle" fontSize="13" fill="#666">
            Ocasional
          </text>
          <text x="266" y="232" textAnchor="middle" fontSize="13" fill="#666">
            Semanal
          </text>
          <text x="388" y="232" textAnchor="end" fontSize="13" fill="#666">
            Regular
          </text>
        </svg>
        <div className="activity-note">
          <strong>◉ {label}</strong>
          <p>
            Indicaste: {activity || 'Ainda não tenho uma rotina'}. O desafio ajuda-te a organizar o
            próximo passo.
          </p>
        </div>
      </div>
    </>
  );
}

interface PlanProgressChartProps {
  days: number;
}

export function PlanProgressChart({ days }: PlanProgressChartProps) {
  const points = calculatePlanPoints(days);

  return (
    <div className="chart">
      <svg
        viewBox="0 0 420 235"
        role="img"
        aria-label={`Calendário de três semanas, com ${days} momentos de prática planeados por semana`}
      >
        <defs>
          <linearGradient id="practice-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0891b2" stopOpacity=".25" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity=".01" />
          </linearGradient>
        </defs>
        <path d="M35 180H390M35 130H390M35 80H390M35 30H390" stroke="#eee" strokeDasharray="4 5" />
        <path
          d="M35 180 C80 180 90 150 145 130 S210 90 255 80 S335 30 385 30 L385 180H35Z"
          fill="url(#practice-fill)"
        />
        <path
          d="M35 180 C80 180 90 150 145 130 S210 90 255 80 S335 30 385 30"
          fill="none"
          stroke="#0891b2"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill="#0891b2" stroke="white" strokeWidth="3" />
            <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0891b2">
              {p.label}
            </text>
          </g>
        ))}
        <text x="35" y="212" textAnchor="middle" fontSize="13" fill="#666">
          Hoje
        </text>
        <text x="145" y="212" textAnchor="middle" fontSize="13" fill="#666">
          Semana 1
        </text>
        <text x="255" y="212" textAnchor="middle" fontSize="13" fill="#666">
          Semana 2
        </text>
        <text x="385" y="212" textAnchor="middle" fontSize="13" fill="#666">
          Semana 3
        </text>
      </svg>
    </div>
  );
}

export function WeeksBreakdown() {
  return (
    <div className="week-list">
      <div className="week">
        <b>1</b>
        <div>
          <strong>Conhecer os movimentos</strong>
          <p>Dias 1 a 7 · Familiarização, respiração e consciência corporal.</p>
        </div>
      </div>
      <div className="week">
        <b>2</b>
        <div>
          <strong>Encontrar o teu ritmo</strong>
          <p>Dias 8 a 14 · Repetir com atenção e organizar os teus momentos de prática.</p>
        </div>
      </div>
      <div className="week">
        <b>3</b>
        <div>
          <strong>Consolidar a rotina</strong>
          <p>Dias 15 a 21 · Rever o que aprendeste e preparar a continuidade.</p>
        </div>
      </div>
    </div>
  );
}
