import { StarFilledIcon } from "@radix-ui/react-icons";
import { Policy } from "../types";
import { Badge } from "./Badge";
// import "./policy-card.css";

function ToggleStar({ starred, set }: { starred: boolean, set: (b: boolean) => void }) {
  // const { starred, set } = useStarred()
  // const isStarred = starred.includes(id)
  if (starred) return <StarFilledIcon
    className="star filled"
    onClick={() => set(false)}
  />
  else return <StarFilledIcon
    className="star"
    onClick={() => set(true)}
  />
}

export function PolicyCard({
  policy, onClick, id, size,
  starred, setStarred,
}: {
  policy: Policy,
  onClick?: () => void,
  id?: string,
  size?: number,
  starred?: boolean,
  setStarred?: (b: boolean) => void,
}) {
  return (
    <div
      id={id}
      className={`VCard ${policy.type} ${starred ? 'starred' : ''}`}
      style={{
        maxWidth: size ? `${size}px` : undefined,
        cursor: onClick ? "pointer" : "auto",
      }}
      onClick={onClick}
    >
      <section className="TitleSection">

        {(starred !== undefined && setStarred !== undefined) ? <ToggleStar starred={starred} set={setStarred} /> : <div />}

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
