import * as Collapsible from '@radix-ui/react-collapsible';
import { IconButton } from "./IconButton";
import { ChevronLeftIcon, ChevronRightIcon, Cross1Icon, Crosshair2Icon } from '@radix-ui/react-icons'
import { styled } from "../stitches.config";
import { ReactNode, useState } from "react";
import { cloudify, ImageUploadButton } from "./ImageUploadButton";
import { GeolocationAccessory } from "./GeolocationAccessory";
import { EmotionSelect } from "./EmotionSelect";
import { Appreciation, Policy, Value, Location } from "../types";
import { BoldedList } from "./BoldedList";
import * as Multipane from "./Multipane";
import { AttendablesConfigurator, WobConfigurator } from './ValueGarden';
import { isWhat } from '../emotions';
import { Button } from './Button';
import { Attendable, PolicyCard, SectionHeader, Tags, Top, VCard } from "./PolicyCard";
import { Badge } from './Badge';

type PaneId = 'garden' | 'attendables' | 'wobs';

const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray11",
  padding: "8px 16px 0px",
})

const LocationBubble = styled(Collapsible.Content, {
  backgroundColor: '#fff',
  borderRadius: '10px',
  background: "lightblue",
  margin: "8px",
  padding: "8px",
  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
  display: 'flex',
  "&[data-state='closed']": {
    display: "none"
  },
  "& > *": {
    flex: 1,
  }
})

const ControlGroup = styled('div', {
  display: 'flex',
  gap: "8px",
  alignItems: 'center',
  background: "#eee",
  padding: "8px",
})

const LocatonToggler = styled(IconButton, {
  "&[data-state=open]": {
    backgroundColor: "lightblue"
  }
})

function CellButton({ children, onClick }: { children: ReactNode, onClick: () => void }) {
  return (
    <Button cell onClick={onClick}>
      <span style={{ flex: "auto" }}>{children}</span>
      <ChevronRightIcon />
    </Button>
  )
}

function OnlyLifeGetsCard({ lifeGets, setActivePane }: {
  lifeGets: string[]
  setActivePane: (pane: PaneId) => void
}) {
  return <VCard css={{ maxWidth: 300, margin: "16px auto" }}>
    <SectionHeader> A way of being </SectionHeader>
    <Tags onClick={() => setActivePane('wobs')}>
      {lifeGets.map(t => <Badge key={t} variant="lifeGets">{t}</Badge>)}
    </Tags>
  </VCard>
}

function EditableTitleCard({ lookFor, lifeGets, setName, name, setActivePane }: {
  name: string,
  setName: (name: string) => void,
  lookFor: Policy['lookFor'],
  lifeGets: string[],
  setActivePane: (pane: PaneId) => void
}) {
  return (
    <VCard css={{ maxWidth: 300, margin: "16px auto" }}>
      <Top>
        <div />
        <main>
          <input
            style={{ padding: "8px", fontSize: "$2", border: "none", outline: "none" }}
            name="name" placeholder='Give this value a name!' value={name} onChange={(e) => setName(e.target.value)} />
        </main>
        <div />
      </Top>
      <SectionHeader> what I look for </SectionHeader>
      <section onClick={() => setActivePane('attendables')}>
        {lookFor.map(a => (
          <Attendable key={a.terms[0]}>
            <Badge variant='lookFor'>{a.terms.join(", ")}</Badge>
            {a.qualifier}
          </Attendable>
        ))}
      </section>
      <SectionHeader> part of being </SectionHeader>
      <Tags onClick={() => setActivePane('wobs')}>
        {lifeGets.map(t => <Badge variant="lifeGets">{t}</Badge>)}
      </Tags>
    </VCard>
  );
}


function EmptyValueGarden({ onClick }: { onClick: () => void }) {
  return <CellButton onClick={onClick}>
    Add a value
  </CellButton>
}

function NeedsLookForsValueGarden({ lifeGets, setActivePane }: { lifeGets: string[], setActivePane: (s: PaneId) => void }) {
  return <>
    <OnlyLifeGetsCard lifeGets={lifeGets} setActivePane={setActivePane} />
    <CellButton onClick={() => setActivePane('attendables')}>
      Specify attention
    </CellButton>
    <Hint>
      Complete the value, by describing what you attend to, when you live by it.
    </Hint>
  </>
}

function PickedValueGarden({ value, onDelete, feelings }: {
  value: Value,
  onDelete: () => void,
  feelings: string[],
}) {
  return <>
    <div style={{ display: "flex", justifyContent: "start" }}>
      <PolicyCard size={300} policy={value} />
      <IconButton variant="ghost" onClick={onDelete}>
        <Cross1Icon />
      </IconButton>
    </div>
  </>
}


export function Appreciator({ onSave, getRelatedValues }: {
  onSave: (result: Appreciation) => void
  getRelatedValues?: (lifeGets: string[]) => Promise<Value[]>
}) {
  const [activePane, setActivePane] = useState<PaneId>('garden');
  const [feelings, setFeelings] = useState<string[]>([])
  const [value, setValue] = useState<Value>()
  const [name, setName] = useState('')

  const [draft, setDraft] = useState<{ [what: string]: { lifeGets: string[] } }>({})
  const lifeGets = Object.values(draft).reduce((prev, curr) => prev.concat(curr.lifeGets), [] as string[])
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>({});
  const lookFors = Object.keys(annotations).map(tag => ({
    terms: [tag],
    qualifier: annotations[tag]
  }))

  const [image, setImage] = useState<File>()
  const [location, setLocation] = useState<Location>()
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)

  const canPost = value || (name && lookFors.length > 0 && lifeGets.length > 0)

  async function onPost() {
    const imageUrl = isLocationEnabled && image && await cloudify(image)
    if (!canPost) return
    onSave({
      feelings,
      value: value || {
        name,
        type: 'exploratory',
        lookFor: Object.keys(annotations).map(tag => ({
          terms: [tag],
          qualifier: annotations[tag]
        })),
        lifeGets,
      },
      location,
      imageUrl,
    })
  }

  const valueGarden = (
    value
      ? <PickedValueGarden value={value} feelings={feelings} onDelete={() => setValue(undefined)} />
      : lookFors.length
        ? <EditableTitleCard lifeGets={lifeGets} lookFor={lookFors} name={name} setName={setName} setActivePane={setActivePane} />
        : lifeGets.length
          ? <NeedsLookForsValueGarden lifeGets={lifeGets} setActivePane={setActivePane} />
          : <EmptyValueGarden onClick={() => setActivePane('wobs')} />)

  return (
    <Multipane.Root active={activePane}>
      <Multipane.Pane id="garden">
        <Multipane.Top
          rButton={
            <Button onClick={onPost} disabled={!canPost}>
              Post
            </Button>
          }
        >Appreciate!</Multipane.Top>
        <Collapsible.Root onOpenChange={setIsLocationEnabled}>
          <LocationBubble>
            <GeolocationAccessory onCoordsChange={setLocation} />
            <ImageUploadButton image={image} setImage={setImage} />
          </LocationBubble>
          <ControlGroup>
            <EmotionSelect
              css={{ flex: "auto" }}
              variant='inset'
              feelings={feelings}
              onFeelingsChanged={setFeelings}
            />
            <Collapsible.Trigger asChild>
              <LocatonToggler><Crosshair2Icon /></LocatonToggler>
            </Collapsible.Trigger>
          </ControlGroup>
        </Collapsible.Root>

        {feelings.length > 0 && <Multipane.PaneBody>
          <div style={{ textAlign: "center", paddingTop: "16px" }}>
            The following value of mine is <BoldedList or words={isWhat(feelings)} />
          </div>
          {valueGarden}
        </Multipane.PaneBody>}


      </Multipane.Pane>
      <Multipane.Pane id="wobs">
        <Multipane.Top
          lButton={
            <IconButton onClick={() => setActivePane('garden')}><ChevronLeftIcon /> </IconButton>
          }
        >What's Important?</Multipane.Top>
        <WobConfigurator draft={draft} setDraft={setDraft} feelings={feelings} />
      </Multipane.Pane>
      <Multipane.Pane id="attendables">
        <Multipane.Top
          lButton={
            <IconButton onClick={() => setActivePane('garden')}><ChevronLeftIcon /> </IconButton>
          }
        >I look for...</Multipane.Top>

        <AttendablesConfigurator
          annotations={annotations}
          setAnnotations={setAnnotations}
          lifeGets={lifeGets}
          onRelatedValuePicked={(value) => {
            setValue(value);
            setActivePane('garden');
          }}
          feelings={feelings}
          getRelatedValues={getRelatedValues}
        />
      </Multipane.Pane>
    </Multipane.Root>
  )
}
