export const IconEye = ({size = 20, stroke = 1.5}: { size?: number, stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
       strokeWidth={stroke}>
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/>
      <path d="M21 12q-3.6 6-9 6t-9-6q3.6-6 9-6t9 6"/>
    </g>
  </svg>
)

export const IconEdit = ({size = 20, stroke = 1.5}: { size?: number, stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke}>
      <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
      <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/>
    </g>
  </svg>
)

export const IconDelete = ({size = 20, stroke = 1.5}: { size?: number, stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke}
          d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
  </svg>
)

export const IconExcavator = ({size = 20, stroke = 1.5}: { size?: number, stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke}>
      <path d="M2 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m9 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0m2 2H4m0-4h9"/>
      <path d="M8 12V7h2a3 3 0 0 1 3 3v5"/>
      <path d="M5 15v-2a1 1 0 0 1 1-1h7m8.12-2.12L18 5l-5 5m8.12-.12A3 3 0 0 1 19 15a3 3 0 0 1-2.12-.88z"/>
    </g>
  </svg>
)

export const IconDead = ({size = 20, stroke = 1.5}: { size?: number, stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke}>
      <path
        d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901-.755 3.637-2 4.96V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2.54c-1.245-1.322-2-3.058-2-4.96C4 7.358 7.582 4 12 4m-2 13v3m4-3v3"/>
      <path d="M8 11a1 1 0 1 0 2 0a1 1 0 1 0-2 0m6 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>
    </g>
  </svg>

)

// @ts-ignore
export const IconShield = ({size = 20, stroke = 1.5}: { size?: number, stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor"
          d="m11.998 2l.032.002l.086.005a1 1 0 0 1 .342.104l.105.062l.097.076l.016.015l.247.21a11 11 0 0 0 7.189 2.537l.342-.01a1 1 0 0 1 1.005.717a13 13 0 0 1-9.208 16.25a1 1 0 0 1-.502 0A13 13 0 0 1 2.54 5.718a1 1 0 0 1 1.005-.717a11 11 0 0 0 7.791-2.75l.046-.036l.053-.041a1 1 0 0 1 .217-.112l.075-.023l.036-.01a1 1 0 0 1 .12-.022l.086-.005zM12 4.296l-.176.135a13 13 0 0 1-7.288 2.572l-.264.006l-.064.31a11 11 0 0 0 1.064 7.175l.17.314a11 11 0 0 0 6.49 5.136l.068.019z"/>
  </svg>
)
