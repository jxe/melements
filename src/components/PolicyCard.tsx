import { BookmarkIcon, Pencil1Icon, BookmarkFilledIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { styled } from "../stitches.config";
import { Policy } from "../types";
import { Avatar, AvatarGroup } from "./Avatar";
import { Badge } from "./Badge";
import { Checkbox, CheckboxListDrawer } from "./CheckboxListDrawer";
import { PolicyEditor } from "./PolicyEditor";

export function PolicyCardFrame({ name, lookFors, lifeGets }: {
  name: ReactNode,
  lookFors: ReactNode,
  lifeGets: ReactNode
}) {
  return <VCard>
    {name}
    <SectionHeader> what I look for </SectionHeader>
    {lookFors}
    <SectionHeader> part of being </SectionHeader>
    {lifeGets}
  </VCard>
}

const VCard = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  border: "solid 0.5px var(--card-outline)",
  "--card-outline": "hsl(0, 0%, 76%)",
  "--dark-stripe": "hsl(213, 80%, 96%)",
  "--yellow-stripe": "hsl(56, 88%, 90%)",
  "--blue-text": "hsl(213, 94%, 42%)",
  "--gold-highlight": "hsl(48, 100%, 58%)",
  "--gold-highlight-relaxed": "hsl(48, 100%, 78%)",
  "--gold-trim": "hsl(48, 100%, 22%)",
  "--gold-text": "hsl(48, 100%, 35%)",
  "--gold-gloss": "hsl(48, 100%, 94%)",

  backgroundImage: "linear-gradient( 45deg, #ffffff 25%, var(--dark-stripe) 25%, var(--dark-stripe) 50%, #ffffff 50%, #ffffff 75%, var(--dark-stripe) 75%, var(--dark-stripe) 100%)",
  backgroundSize: "5.66px 5.66px",
  variants: {
    starred: {
      true: {
        backgroundImage: "linear-gradient( 45deg, #ffffff 25%, var(--yellow-stripe) 25%, var(--yellow-stripe) 50%, #ffffff 50%, #ffffff 75%, var(--yellow-stripe) 75%, var(--yellow-stripe) 100% )"
      }
    }
  }
})

const BaseHeader = styled('div', {
  display: "flex",
  justifyContent: "center",
  paddingBottom: "1rem", // 6px
  borderTop: "solid 0.5px var(--card-outline)",
  marginTop: "16px",
  position: "relative",
  "& b": {
    marginTop: "-8px",
    marginBottom: "-8px",
    textTransform: "uppercase",
    fontWeight: "400",
    fontSize: "13px",
    padding: "0px 8px",
    color: "#888",
    backgroundColor: "white",
    border: "solid 0.5px var(--card-outline)"
  }
})

export function SectionHeader({ children }: { children: ReactNode }) { return <BaseHeader><b>{children}</b></BaseHeader> }

const Top = styled('div', {
  display: "grid",
  gridTemplateColumns: "40px 1fr 40px",
  alignItems: "center",
  paddingTop: "8px",

  "& main": {
    textTransform: "uppercase",
    fontWeight: "600",
    textAlign: "center",
    fontSize: "22px",
  }
})

const Tags = styled('div', {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  padding: "6px 8px 14px",
  justifyContent: "center",

})

const Attendable = styled('div', {
  padding: "2px 12px",
  color: "#444",
  alignItems: "baseline",
  flexWrap: "wrap",
  fontSize: "15px",
  "& :first-child": {
    marginRight: "4px"
  }
})

interface List {
  uuid: string,
  name: string,
  _count: {
    values: number
  }
}

export function SaveButton({ savedToListIds, setSavedToListIds, lists }: {
  savedToListIds: string[],
  setSavedToListIds: (b: string[]) => Promise<any>,
  lists: List[],
}) {
  return <CheckboxListDrawer
    selected={savedToListIds}
    setSelected={setSavedToListIds}
    trigger={savedToListIds.length > 0 ?
      <BookmarkFilledIcon /> :
      <BookmarkIcon />}
  >
    {lists.map(({ uuid, name, _count }) =>
      <Checkbox id={uuid} key={uuid}>
        {name} ({_count.values} values)
      </Checkbox>
    )}
  </CheckboxListDrawer>
}

export function PolicyCard({
  policy, onClick, id, size, starred,
  leftButton,
  onEdited
}: {
  policy: Policy,
  onClick?: () => void,
  id?: string,
  size?: number,
  starred?: boolean,
  onEdited?: (policy: Policy) => void,
  leftButton?: ReactNode,
}) {
  const [editing, setEditing] = useState(false)
  if (editing) return <PolicyEditor
    initialPolicy={policy}
    onSave={onEdited!}
    onCancel={() => setEditing(false)}
  />
  return (
    <VCard
      id={id}
      starred={starred}
      // variants={starred ? { starred: true } : {}}
      // className={`VCard ${policy.type} ${starred ? 'starred' : ''}`}
      css={{
        maxWidth: size ? `${size}px` : undefined,
        cursor: onClick ? "pointer" : "auto",
      }}
      onClick={onClick}
    >
      <Top>
        {leftButton || <div />}
        <main>{policy.name}</main>
        {onEdited ? (
          <Pencil1Icon onClick={() => setEditing(true)} />
        ) : null}
      </Top>
      <SectionHeader> what I look for </SectionHeader>
      <section>
        {policy.lookFor.map(a => (
          <Attendable>
            <Badge variant='lookFor'>{a.terms.join(", ")}</Badge>
            {a.qualifier}
          </Attendable>
        ))}
      </section>
      <SectionHeader> part of being </SectionHeader>
      <Tags>
        {policy.lifeGets.map(t => <Badge variant="lifeGets">{t}</Badge>)}
      </Tags>
    </VCard>
  );
}
