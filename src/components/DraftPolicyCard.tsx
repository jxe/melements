import { SectionHeader, Top, VCard } from "./PolicyCard";
import React, { ReactNode, useEffect, useState } from 'react';
import { styled } from "../stitches.config";
import { BoldedList } from "./BoldedList";
import { areNegative, isWhat } from '../emotions';
import { QualitiesSelect } from "./QualitiesSelect";
import { POASelect } from "./POASelect";
import { Location } from "../types";

export interface Topic {
  type: 'emotions' | 'spot'
  feelings: string[],
  image?: File,
  location?: Location,
}

export interface Annotations {
  [tag: string]: string
}

function ExpandableVCard({ children, brNode }: { children: ReactNode, brNode?: ReactNode }) {
  return <VCard css={{
    marginBottom: brNode ? '32px' : undefined,
    width: 300, marginTop: "16px", marginLeft: "auto", marginRight: "auto"
  }}>
    {children}
    {brNode && <div style={{ position: "absolute", bottom: "-20px", right: 0 }}>
      {brNode}
    </div>}
  </VCard>
}

const Dot = styled("span", {
  width: "8px",
  height: "8px",
  borderRadius: "4px",
  backgroundColor: "var(--blue-text)",
  display: "inline-block",
  variants: {
    marginalia: {
      true: {
        position: "absolute",
        left: "-18px",
        marginTop: "14px",
      }
    }
  }
})

const TitleInput = styled('input', {
  padding: "8px",
  fontSize: "$4",
  border: "none",
  outline: "none",
  textAlign: "center",
  maxWidth: "210px",
  "&::placeholder": {
    textAlign: "center",
  },
  "&[disabled]": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
})

export interface ValueDraft {
  name: string,
  annotations: Annotations,
  lifeGets: string[],
}

export function DraftPolicyCard({
  topic, brNode,
  valueDraftChanged, updateTip,
  initialValueDraft = {
    name: "",
    annotations: {},
    lifeGets: [],
  }
}: {
  brNode?: ReactNode,
  topic: Topic,
  initialValueDraft: ValueDraft,
  valueDraftChanged: (valueDraft: ValueDraft) => void,
  updateTip?: (tip: ReactNode) => void,
}) {
  const [name, setName] = useState(initialValueDraft.name);
  const [lifeGets, setLifeGets] = useState<string[]>(initialValueDraft.lifeGets);
  const [annotations, setAnnotations] = useState<Annotations>(initialValueDraft.annotations);

  const next =
    Object.values(annotations).some(x => x)
      ? (name.length > 3 ? null : 'title')
      : (lifeGets.length > 1 ? 'attendables' : 'qualities')
  const valence = topic.type === 'spot' ? 'present' : areNegative(topic.feelings) ? 'absent' : 'present'

  useEffect(
    () => {
      const tipHeader = next === 'title' ? <>Finally, add a title.</> : next === 'qualities' ? <> Add qualities</>
        : <>Add paths of attention</>

      valueDraftChanged({
        name,
        annotations,
        lifeGets,
      })
      updateTip && updateTip(
        next ? <TipContainer header={tipHeader}>
          {next === 'title' ? null : next === 'qualities' ? (topic.type === 'spot' ? <>What way of living are you experiencing?</>
            : <>{
              valence === 'absent' ? "How do you wish you were living?" : "What's going well?"
            } What value is <BoldedList or words={isWhat(topic.feelings)} /></>
          ) : next === 'attendables' ? <>{valence === 'present' ? "When you are" : "Imagine you were able to be"} <BoldedList words={lifeGets} /> in this way—what {valence === 'present' ? 'are you' : "would you be"} paying attention to?</>
            : null}
        </TipContainer> : null
      )

    }, [name, lifeGets, annotations, topic]
  )

  return (
    <ExpandableVCard brNode={brNode}>
      {(next === 'title' || !next) &&
        <Top>
          <div />
          <main>
            {next === 'title' && <Dot marginalia />}
            <TitleInput
              name="name"
              placeholder='Add a title'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </main>
          <div />
        </Top>
      }
      <SectionHeader> {valence === 'present' ? "Things are" : "If only things would be"} </SectionHeader>
      <section>
        {next === 'qualities' && <Dot marginalia />}
        <QualitiesSelect
          topic={topic}
          lifeGets={lifeGets}
          setLifeGets={setLifeGets}
        />
      </section>
      <SectionHeader> {valence === 'present' ? "because I am following" : "and if I could follow"} </SectionHeader>
      <section>
        {next === 'attendables' && <Dot marginalia />}
        <POASelect
          disabled={lifeGets.length === 0}
          annotations={annotations}
          setAnnotations={setAnnotations}
        />
      </section>
    </ExpandableVCard>
  );
}

const TipBox = styled("div", {
  color: "var(--blue-text)",
  background: "$blue3",
  padding: "16px",
  display: "flex",
  gap: "8px",
  borderTop: "solid 0.25px $blueTextRelaxed"
})

function TipContainer({ header, children }: { header: ReactNode, children?: ReactNode }) {
  return <TipBox>
    <Dot css={{ flexShrink: 0, marginTop: "6px" }} />
    <div>
      <span style={{ fontWeight: 600 }}>
        {header}
      </span> &mdash; {children}
    </div>
  </TipBox>
}