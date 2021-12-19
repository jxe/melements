import { Policy } from "../types";

export function PolicyCard({
  policy, onClick, id, size = 300
}: {
  policy: Policy,
  onClick?: () => void,
  id?: string,
  size?: number,
}) {
  return (
    <div
      id={id}
      className={`VCard ${policy.type}`}
      style={{
        maxWidth: `${size}px`,
        cursor: onClick ? "pointer" : "auto",
      }}
      onClick={onClick}
    >
      <section className="TitleSection">
        <main>{policy.name}</main>
      </section>
      <section>
        <h4> <b>what I look for</b> </h4>
        <main>
          {policy.lookFor.map(a => (
            <div className="Attendable">
              <b>{a.terms.join(', ')}</b>
              {a.qualifier}
            </div>
          ))}
        </main>
      </section>
      <section className="BeingSection">
        <h4><b>part of being</b></h4>
        <main>
          {policy.lifeGets.map(t => <span className="Tag">{t}{" "}</span>)}
        </main>
      </section>
    </div>
  );
}
