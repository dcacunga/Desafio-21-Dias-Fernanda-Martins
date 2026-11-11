import { useState, useRef, useEffect, useCallback } from 'react';

interface HeightRulerProps {
  initialValue?: number;
  unit?: string;
  altUnit?: string;
  min?: number;
  max?: number;
  onChange: (val: number, unit: string) => void;
  onSubmit: (val: number) => void;
}

export function HeightRuler({
  initialValue = 165,
  unit = 'cm',
  altUnit = 'pol',
  min = 100,
  max = 230,
  onChange,
  onSubmit,
}: HeightRulerProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>(unit);
  const factor = 1 / 2.54; // cm to inches
  const isAlt = selectedUnit === altUnit;

  const currentMin = isAlt ? Math.ceil(min * factor * 10) / 10 : min;
  const currentMax = isAlt ? Math.floor(max * factor * 10) / 10 : max;
  const tickMin = Math.floor(currentMin);
  const tickMax = Math.ceil(currentMax);

  // Stored in cm internally
  const [valueCm, setValueCm] = useState<number>(initialValue);

  const displayVal = isAlt
    ? Math.round(valueCm * factor * 10) / 10
    : Math.round(valueCm * 10) / 10;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; val: number } | null>(null);

  // Position track so current displayVal aligns with center
  const updateTransform = useCallback(
    (currentDisplayVal: number) => {
      if (!viewportRef.current || !trackRef.current) return;
      const vpWidth = viewportRef.current.clientWidth || 300;
      const offset = vpWidth / 2 - (currentDisplayVal - tickMin) * 20 - 10;
      trackRef.current.style.transform = `translateX(${offset}px)`;
    },
    [tickMin]
  );

  useEffect(() => {
    updateTransform(displayVal);
  }, [displayVal, updateTransform]);

  useEffect(() => {
    const handleResize = () => updateTransform(displayVal);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [displayVal, updateTransform]);

  const setNextVal = (nextDisplay: number) => {
    const clamped = Math.max(currentMin, Math.min(currentMax, nextDisplay));
    const rounded = Math.round(clamped * 10) / 10;
    const newCm = isAlt ? Math.round((rounded / factor) * 10) / 10 : rounded;
    setValueCm(newCm);
    onChange(newCm, selectedUnit);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, val: displayVal };
    if (viewportRef.current) {
      viewportRef.current.setPointerCapture(e.pointerId);
      viewportRef.current.classList.add('dragging');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const delta = -dx / 20;
    setNextVal(dragRef.current.val + delta);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (viewportRef.current) {
      try {
        viewportRef.current.releasePointerCapture(e.pointerId);
      } catch {}
      viewportRef.current.classList.remove('dragging');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next = displayVal;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += e.shiftKey ? 0.1 : 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= e.shiftKey ? 0.1 : 1;
    else if (e.key === 'Home') next = currentMin;
    else if (e.key === 'End') next = currentMax;
    else return;
    e.preventDefault();
    setNextVal(next);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = (e.deltaX || e.deltaY) / 20;
    setNextVal(displayVal + delta);
  };

  const handleUnitToggle = (newUnit: string) => {
    if (newUnit === selectedUnit) return;
    setSelectedUnit(newUnit);
    onChange(valueCm, newUnit);
  };

  // Generate tick markers
  const ticks = [];
  for (let n = tickMin; n <= tickMax; n++) {
    const isMajor = n % 10 === 0;
    const isMiddle = n % 5 === 0 && !isMajor;
    ticks.push(
      <span
        key={n}
        className={`ruler-tick ${isMajor ? 'major' : isMiddle ? 'middle' : ''}`}
      >
        {isMajor && <b>{n}</b>}
      </span>
    );
  }

  return (
    <form
      id="answer-form"
      className="measure"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(valueCm);
      }}
    >
      <div className="unit-tabs">
        <button
          type="button"
          data-unit={unit}
          className={!isAlt ? 'active' : ''}
          onClick={() => handleUnitToggle(unit)}
        >
          {unit}
        </button>
        <button
          type="button"
          data-unit={altUnit}
          className={isAlt ? 'active' : ''}
          onClick={() => handleUnitToggle(altUnit)}
        >
          {altUnit}
        </button>
      </div>

      <div className="measure-entry">
        <input
          id="measure-number"
          name="value"
          type="number"
          step="any"
          inputMode="decimal"
          min={currentMin}
          max={currentMax}
          value={displayVal}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!Number.isNaN(val)) {
              setNextVal(val);
            }
          }}
          aria-label="Qual é a tua altura?"
          required
        />
        <span>{selectedUnit}</span>
      </div>

      <div className="weight-ruler">
        <div
          ref={viewportRef}
          className="ruler-viewport"
          role="slider"
          tabIndex={0}
          aria-label={`Ajustar altura em ${selectedUnit}`}
          aria-valuemin={currentMin}
          aria-valuemax={currentMax}
          aria-valuenow={displayVal}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
        >
          <div ref={trackRef} className="ruler-track">
            {ticks}
          </div>
        </div>
        <i className="ruler-needle" />
      </div>

      <input
        className="accessible-range"
        aria-hidden="true"
        tabIndex={-1}
        id="measure-range"
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={valueCm}
        onChange={(e) => setNextVal(parseFloat(e.target.value))}
      />

      <p className="helper">Arrasta para ajustar ou escreve o valor.</p>
      <button className="primary" type="submit">
        Continuar
      </button>
    </form>
  );
}
