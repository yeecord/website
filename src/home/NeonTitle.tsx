/** 霓虹招牌標題：每行不斷字，字一個一個亮起來 */
export function NeonTitle({ lines }: { lines: string[] }) {
  return (
    <h1 className="night-title" aria-label={lines.join("")}>
      {lines.map((line, row) => (
        <span key={line} aria-hidden>
          {[...line].map((character, column) => (
            <i
              key={`${column}-${character}`}
              style={{ animationDelay: `${(row * 7 + column) * 55}ms` }}
            >
              {character}
            </i>
          ))}
        </span>
      ))}
    </h1>
  );
}
