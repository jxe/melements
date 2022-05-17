import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

export function TabbedDrawer({ tabs, renderContentForTab }: {
  tabs: string[],
  renderContentForTab: (tab: string) => JSX.Element,
}) {
  if (tabs.length === 1) {
    return renderContentForTab(tabs[0]);
  }
  return (
    <Tabs css={{ display: "flex", flexDirection: "column", position: "absolute", inset: 0 }}>
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab} css={{ overflowY: "auto" }} value={tab}>
          {renderContentForTab(tab)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
