import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Policy } from "../types";
import { Badge } from "./Badge";

function ToggleStar({ starred, set }: { starred: boolean, set: (b: boolean) => void }) {
  // const { starred, set } = useStarred()
  // const isStarred = starred.includes(id)
  if (starred) return <StarFilledIcon
    // width="20px"
    // height="20px"
    fill="var(--gold-highlight)"
    stroke="black"
    onClick={() => set(false)}
  />
  else return <StarIcon onClick={() => set(true)} />
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
      className={`VCard ${policy.type}`}
      style={{
        maxWidth: size ? `${size}px` : undefined,
        cursor: onClick ? "pointer" : "auto",
      }}
      onClick={onClick}
    >
      <section className="TitleSection">
        <main>{policy.name}</main>
        {starred !== undefined && setStarred !== undefined && <ToggleStar starred={starred} set={setStarred} />}
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
