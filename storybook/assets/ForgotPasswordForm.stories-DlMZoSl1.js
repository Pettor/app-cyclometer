import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r}from"./react-intl-Cbi0DCdi.js";import{t as i}from"./jsx-runtime-DeHZSEgm.js";import{n as a,t as o}from"./button-C7F1kAv9.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./InputField-DuoRxblc.js";import{n as p,t as m}from"./spinner-OeagCd1s.js";import{c as h,t as g}from"./src-D6kimeDb.js";import{i as _,n as v,r as y,t as b}from"./FormValidation-lCnEOzm5.js";import{i as x,o as S}from"./schemas-Dv8H71D_.js";var C;function w(){return(w=e((()=>{n(),C=t({emailLabel:{description:`ForgotPasswordForm: label - email input`,defaultMessage:`Email`,id:`zoMR5Z`},submitAriaLabel:{description:`ForgotPasswordForm: aria-label - submit button`,defaultMessage:`Submit`,id:`UF/bNZ`},submit:{description:`ForgotPasswordForm: button - submit send`,defaultMessage:`Send`,id:`ov7hhw`}})})))()}function T({loading:e,onSubmit:t}){let n=r(),{emailSchema:i}=v(),a=S({email:i}),l=c({defaultValues:{email:``},validators:{onSubmit:a},onSubmit:async({value:e})=>{t(e)}});return(0,E.jsxs)(y,{onSubmit:e=>{e.preventDefault(),e.stopPropagation(),l.handleSubmit()},className:`flex w-full flex-col justify-center gap-4`,children:[(0,E.jsx)(l.Field,{name:`email`,children:e=>(0,E.jsx)(f,{autoFocus:!0,field:e,type:`email`,fullWidth:!0,label:n.formatMessage(C.emailLabel),startContent:(0,E.jsx)(s,{className:`h-5 w-5`}),"data-testid":`forgot-password-form__email-input`})}),(0,E.jsx)(l.Subscribe,{selector:e=>[e.canSubmit],children:([t])=>(0,E.jsx)(o,{isDisabled:!t||e,variant:`primary`,type:`submit`,size:`lg`,className:`mt-2 w-full`,"aria-label":n.formatMessage(C.submitAriaLabel),"data-testid":`forgot-password-form__submit-button`,children:e?(0,E.jsx)(m,{size:`sm`}):n.formatMessage(C.submit)})})]})}var E;function D(){return(D=e((()=>{u(),a(),_(),p(),d(),n(),x(),b(),w(),l(),E=i(),T.__docgenInfo={description:``,methods:[],displayName:`ForgotPasswordForm`,props:{loading:{required:!0,tsType:{name:`boolean`},description:``},onSubmit:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(data: FormForgotPassword) => void`,signature:{arguments:[{type:{name:`FormForgotPassword`},name:`data`}],return:{name:`void`}}},description:``}}}})))()}var O,k,A,j,M,N,P;function F(){return(F=e((()=>{g(),D(),{expect:O}=__STORYBOOK_MODULE_TEST__,k={component:T,title:`Forms/Forgot Password`,decorators:[h],parameters:{a11y:{config:{rules:[{id:`color-contrast`,enabled:!1}]}}}},A={loading:!1,onSubmit:()=>console.log(`onSubmit`)},j={args:A},M={args:A,play:async({canvas:e,userEvent:t})=>{await t.type(e.getByTestId(`forgot-password-form__email-input`),`email@provider.com`),await t.click(e.getByTestId(`forgot-password-form__submit-button`)),await O(e.getByTestId(`forgot-password-form__email-input`)).toHaveValue(`email@provider.com`)}},N={args:A,play:async({canvas:e,userEvent:t})=>{await t.click(e.getByTestId(`forgot-password-form__submit-button`)),await O(e.getByText(`Email must be valid`)).toBeInTheDocument()}},P=[`Standard`,`Success`,`IncorrectEmail`],j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: defaultArgs
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.type(canvas.getByTestId("forgot-password-form__email-input"), "email@provider.com");
    await userEvent.click(canvas.getByTestId("forgot-password-form__submit-button"));
    await expect(canvas.getByTestId("forgot-password-form__email-input")).toHaveValue("email@provider.com");
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getByTestId("forgot-password-form__submit-button"));
    await expect(canvas.getByText("Email must be valid")).toBeInTheDocument();
  }
}`,...N.parameters?.docs?.source}}}})))()}F();export{N as IncorrectEmail,j as Standard,M as Success,P as __namedExportsOrder,k as default};