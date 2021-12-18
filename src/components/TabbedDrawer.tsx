import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

export function TabbedDrawer({ tabs, renderContentForTab }: {
  tabs: string[],
  renderContentForTab: (tab: string) => JSX.Element,
}) {
  return (
    <Tabs css={{ display: "flex", flexDirection: "column", position: "absolute", inset: 0 }}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger value={tab}>{tab}</TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent css={{ overflowY: "auto" }} value={tab}>
          {renderContentForTab(tab)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
