import { Policy } from "../types";
import { Badge } from "./Badge";

export function PolicyCard({
  policy, onClick, id, size
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
        maxWidth: size ? `${size}px` : undefined,
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
              <Badge variant='lookFor'>{a.terms.join(", ")}</Badge>
              {a.qualifier}
            </div>
          ))}
        </main>
      </section>
      <section className="BeingSection">
        <h4><b>part of being</b></h4>
        <main>
          {policy.lifeGets.map(t => <Badge variant="lifeGets">{t}</Badge>)}
        </main>
      </section>
    </div>
  );
}
