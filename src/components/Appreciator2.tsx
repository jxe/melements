import * as Collapsible from '@radix-ui/react-collapsible';
import { IconButton } from "./IconButton";
import { Crosshair2Icon } from '@radix-ui/react-icons'
import { styled } from "../stitches.config";
import { ReactNode, useState } from "react";
import { cloudify, ImageUploadButton } from "./ImageUploadButton";
import { GeolocationAccessory } from "./GeolocationAccessory";
import { EmotionSelect } from "./EmotionSelect";
import { Value } from "../types";
import { BoldedList } from "./BoldedList";
import * as Multipane from "./Multipane";
import { AttendablesConfigurator, EmptyValueGarden, NeedsLookForsValueGarden, PickedValueGarden, WobConfigurator } from './ValueGarden';
import { EditableTitleCard } from './PolicyCard';
import { isWhat } from '../emotions';

const CardHeading = styled("div", {
  textTransform: "uppercase",
  fontSize: "$2",
  fontWeight: "500",
  color: "$gray11",
  padding: "8px",
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

interface Appreciation {
  feelings: string[],
  value: Value,
  location?: GeolocationCoordinates,
  imageUrl?: string,
}

const LocatonToggler = styled(IconButton, {
  "&[data-state=open]": {
    backgroundColor: "lightblue"
  }
})

export function Appreciator({ onSave, renderRelatedValues }: {
  onSave: (result: Appreciation) => void
  renderRelatedValues?: (prompt: ReactNode, lifeGets: string[], onPicked: (x: Value) => void) => ReactNode,
}) {
  const [activePane, setActivePanel] = useState<'garden' | 'attendables' | 'wobs'>('garden');
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
  const [location, setLocation] = useState<GeolocationCoordinates>()
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)

  async function handleClick() {
    const imageUrl = isLocationEnabled && image && await cloudify(image)
    if (!value) return
    onSave({
      feelings,
      value,
      location,
      imageUrl,
    })

    const prompt = <>
      What's <BoldedList or words={isWhat(feelings)} />?
    </>

    // const name = prompt("What would you call this way of living?")
    // if (!name) return
    // const value: Value = {
    //   name,
    //   type: 'exploratory',
    //   lookFor: Object.keys(annotations).map(tag => ({
    //     terms: [tag],
    //     qualifier: annotations[tag]
    //   })),
    //   lifeGets,
    // }
    // onSave(value)


  }

  const valueGarden = value ? <PickedValueGarden value={value} feelings={feelings} onDelete={() => setValue(undefined)} /> : lookFors.length ? <EditableTitleCard lifeGets={lifeGets} lookFor={lookFors} name={name} setName={setName} /> : lifeGets.length ? <NeedsLookForsValueGarden lifeGets={lifeGets} onClick={() => setActivePanel('attendables')} /> : <EmptyValueGarden onClick={() => setActivePanel('wobs')} />

  return (
    <Multipane.Root active={activePane}>
      <Multipane.Pane id="garden">
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

        {feelings.length > 0 && <CardHeading>
          What's your <BoldedList words={feelings} /> feeling telling you?
        </CardHeading>}

        {valueGarden}
      </Multipane.Pane>
      <Multipane.Pane id="wobs">
        <WobConfigurator draft={draft} setDraft={setDraft} feelings={feelings} />
      </Multipane.Pane>
      <Multipane.Pane id="attendables">
        <AttendablesConfigurator
          annotations={annotations}
          setAnnotations={setAnnotations}
          lifeGets={lifeGets}
          onDone={() => setActivePanel('garden')}
          renderRelatedValues={
            renderRelatedValues ? (lifeGets) => renderRelatedValues(prompt, lifeGets, setValue) : undefined
          }
        />
      </Multipane.Pane>
    </Multipane.Root>
  )
}
