import { Pencil1Icon, BookmarkFilledIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { styled } from "../stitches.config";
import { List, Policy } from "../types";
import { Badge } from "./Badge";
import { Button } from "./Button";
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

export function OnlyLifeGetsCard({ lifeGets }: {
  lifeGets: string[]
}) {
  return <VCard>
    <SectionHeader> part of being </SectionHeader>
    <Tags>
      {lifeGets.map(t => <Badge variant="lifeGets">{t}</Badge>)}
    </Tags>
  </VCard>
}

export function EditableTitleCard({ lookFor, lifeGets, setName, name }: {
  name: string,
  setName: (name: string) => void,
  lookFor: Policy['lookFor'],
  lifeGets: string[]
}) {
  return (
    <VCard>
      <Top>
        <div />
        <main>
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </main>
        <div />
      </Top>
      <SectionHeader> what I look for </SectionHeader>
      <section>
        {lookFor.map(a => (
          <Attendable>
            <Badge variant='lookFor'>{a.terms.join(", ")}</Badge>
            {a.qualifier}
          </Attendable>
        ))}
      </section>
      <SectionHeader> part of being </SectionHeader>
      <Tags>
        {lifeGets.map(t => <Badge variant="lifeGets">{t}</Badge>)}
      </Tags>
    </VCard>
  );
}


export const VCard = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  paddingBottom: "8px",
  border: "solid 0.5px var(--card-outline)",
  "--card-outline": "hsl(0, 0%, 56%)",
  "--card-outline-lighter": "hsl(0, 0%, 90%)",
  "--dark-stripe": "hsl(213, 90%, 97%)",
  "--dark-white": "hsl(213, 0%, 98%)",
  "--yellow-stripe": "hsl(56, 88%, 90%)",
  "--blue-text": "hsl(213, 94%, 42%)",
  "--gold-highlight": "hsl(48, 100%, 58%)",
  "--gold-highlight-relaxed": "hsl(48, 100%, 78%)",
  "--gold-trim": "hsl(48, 100%, 22%)",
  "--gold-text": "hsl(48, 100%, 35%)",
  "--gold-gloss": "hsl(48, 100%, 94%)",

  backgroundImage: "linear-gradient( 45deg, var(--dark-white) 25%, var(--dark-stripe) 25%, var(--dark-stripe) 50%, var(--dark-white) 50%, var(--dark-white) 75%, var(--dark-stripe) 75%, var(--dark-stripe) 100%)",
  backgroundSize: "5.66px 5.66px",
  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.1), 0px 0px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
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
  justifyContent: "start",
  paddingBottom: "14px", // 6px
  borderTop: "solid 0.5px var(--card-outline)",
  marginTop: "18px",
  marginBottom: "8px",
  position: "relative",
  "& b": {
    marginTop: "-9.5px",
    marginBottom: "-8px",
    marginLeft: "12px",
    textTransform: "uppercase",
    fontWeight: "200",
    fontSize: "12px",
    padding: "2px 8px",
    color: "#666",
    textShadow: "0px 0px 0.5px rgba(0, 0, 0, 0.5)",
    // backgroundColor: "var(--card-outline-lighter)",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "solid 0.5px var(--card-outline)"
  }
})

export function SectionHeader({ children }: { children: ReactNode }) { return <BaseHeader><b>{children}</b></BaseHeader> }

const Top = styled('div', {
  display: "grid",
  gridTemplateColumns: "40px 1fr 40px",
  alignItems: "center",
  paddingTop: "18px",
  paddingBottom: "8px",
  justifyItems: "center",

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

export function SaveButton({ savedToListIds, setSavedToListIds, lists, setSavedToNewList }: {
  savedToListIds: string[],
  setSavedToListIds: (b: string[]) => Promise<any>,
  lists: List[],
  setSavedToNewList?: (name: string) => Promise<any>
}) {
  const listsWithValues = lists.filter(l => l._count.values > 0)
  const listsWithoutValues = lists.filter(l => l._count.values === 0)
  return <CheckboxListDrawer
    selected={savedToListIds}
    setSelected={setSavedToListIds}
    trigger={<BookmarkFilledIcon
      width="20px"
      height="20px"
      strokeWidth="0.5px"
      {...(
        savedToListIds.length > 0 ?
          {
            color: "var(--gold-highlight-relaxed)",
            stroke: "black"
          } : {
            color: "white",
            stroke: "var(--card-outline)",
          }
      )}
      style={{
        position: "absolute",
        top: "-5px",
        right: "10px"
      }}
    />}
  >
    {[...listsWithValues, ...listsWithoutValues].map(({ uuid, name, _count }) =>
      <Checkbox id={uuid} key={uuid}>
        {name} ({_count.values} values)
      </Checkbox>
    )}
    {setSavedToNewList && <>
      <Button onClick={() => {
        const name = prompt("Name of new list?")
        if (name) {
          setSavedToNewList(name)
        }
      }}>New List</Button>
    </>}
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
        {onEdited ? (
          <Pencil1Icon onClick={() => setEditing(true)} />
        ) : <div />}
        <main>{policy.name}</main>
        {leftButton}
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
