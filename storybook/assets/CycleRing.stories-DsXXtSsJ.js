import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./CycleRing-dlaDFUzD.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),{expect:a}=__STORYBOOK_MODULE_TEST__,o={title:`Display/Cycle Ring`,component:r,tags:[`autodocs`],decorators:[e=>(0,i.jsx)(`div`,{className:`w-[400px] max-w-full`,children:(0,i.jsx)(e,{})})]},s={step:{num:7,groups:[4,3],slots:[`a`,`r`,`n`,`r`,`a`,`r`,`n`]},slot:-1,status:`ready`},c={args:s,play:async({canvas:e})=>{await a(e.getByTestId(`cycle-ring__badge`)).toHaveTextContent(`Ready`),await a(e.getByText(`Press play`)).toBeInTheDocument()}},l={args:{...s,slot:0,status:`playing`},play:async({canvas:e})=>{await a(e.getByTestId(`cycle-ring__badge`)).toHaveTextContent(`Downbeat`)}},u={args:{...s,slot:3,status:`playing`},play:async({canvas:e})=>{await a(e.getByTestId(`cycle-ring__badge`)).toHaveTextContent(`Rest`),await a(e.getByText(`Slot 4 / 7`)).toBeInTheDocument()}},d={args:{step:{num:11,groups:[3,3,3,2],slots:[`n`,`n`,`n`,`a`,`n`,`n`,`a`,`n`,`n`,`a`,`n`]},slot:7,status:`playing`}},f={args:{...s,status:`paused`}},p=[`Ready`,`Downbeat`,`Rest`,`SecondGroup`,`Paused`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByTestId("cycle-ring__badge")).toHaveTextContent("Ready");
    await expect(canvas.getByText("Press play")).toBeInTheDocument();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    slot: 0,
    status: "playing"
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByTestId("cycle-ring__badge")).toHaveTextContent("Downbeat");
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    slot: 3,
    status: "playing"
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByTestId("cycle-ring__badge")).toHaveTextContent("Rest");
    await expect(canvas.getByText("Slot 4 / 7")).toBeInTheDocument();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    step: {
      num: 11,
      groups: [3, 3, 3, 2],
      slots: ["n", "n", "n", "a", "n", "n", "a", "n", "n", "a", "n"]
    },
    slot: 7,
    status: "playing"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    status: "paused"
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{l as Downbeat,f as Paused,c as Ready,u as Rest,d as SecondGroup,p as __namedExportsOrder,o as default};