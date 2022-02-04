local isNuiOpened = false


RegisterCommand("calculator", function(source, args, rawCommand)
    DisplayNui(true)
end)

RegisterNUICallback("turn_off_calcualtor", function()
    DisplayNui(false)
end)


function DisplayNui(state)
    SendNUIMessage({
        state=state,
    })
    SetNuiFocus(state, state)
end
