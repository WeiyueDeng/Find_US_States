<script setup>
import { watch, reactive} from 'vue'
import gql from "graphql-tag";
import { ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client/core'
import {provideApolloClient, useQuery } from "@vue/apollo-composable";
import { slotFlagsText } from '@vue/shared';



//init map
const map_url = "https://www.google.com/maps/embed/v1/place?key=<PUT YOUR GOOGLE API KEY HERE>&q=";
const location = "United+States";
const link = map_url+location;
function getData(input, keycode){
    // HTTP connection to the API
    const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:4000',
    })

    // Cache implementation
    const cache = new InMemoryCache()

    // Create the apollo client
    const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    })
    //need to individually create an apolloClient since the useQuery() is used outside of setup
    provideApolloClient(apolloClient)
    //get all matched states query via GraphQL: according to the keyword variable 
    const ALL_STATES = gql`
        #query {
            #getStates{
                #name
                #latitude
                #longitude
            #}
        #}
        query ($keyword: String!){
            states(keyword: $keyword){
                name
            }
        }
    `;
    const {result, variables} = useQuery(ALL_STATES,{ keyword: input});
    // console.log("results ->", result);
    // console.log("keyword to find ->", variables.value.keyword);
    watch(result, (value) => {
        const matchedStates = value.states;
        console.log("states array ->", matchedStates);
        if(keycode == '13'){
            //allow enter key to select:
            //1. check whether the menu is empty
            console.log("enter select");
            var isEmpty =  $('#menu').is(':empty') ;
            //2.if true: we trigger the select event of menu
            if(!isEmpty){
                $("#menu").menu( "select" );
            }
        }else{
            //if user doesn't press enter key: create the menu according to matchedStates and current text in the input box
            createDropDownMenu(matchedStates, variables.value.keyword);
        }
    });
}

function createDropDownMenu(matchedStates, keyword){
    $("#menu").empty();
    //add all states in the menu one at a time
    $.each(matchedStates, function(idx, value){
        var stateName = value.name;
        // console.log("state ->", stateName);
        var keywordCompare = new RegExp(keyword, "gi");
        //all matched parts
        var matchedSubStrings= stateName.match(keywordCompare);
        // console.log(stateName,"->",matchedSubStrings);

        //get edited name format
        var boldenState = boldenStateName(matchedSubStrings, stateName, keywordCompare, keyword.length);

        //init div for each matched state
        var item = $("<li class = 'ui-menu-item'>")
        var stateDiv = $("<div class = 'ui-menu-item-wrapper' idx-data ='"+idx+"'>");
        $(stateDiv).addClass('matched_states');
        //set the text with bolden state name
        $(stateDiv).html(boldenState);
        $(item).append(stateDiv);
        //put the state div under menu div
        $("#menu").append(item);
    });
    //bolden all marked parts
    $("span").css("font-weight", "bolder");

    //enable menu functionalities
    //1. get firstItem which will be focus when a new menu is created
    var firstItem= $(".ui-menu-item-wrapper[idx-data='0']")
    console.log("firstItem->",firstItem.text());
    //make the first item in the menu to be focus when the input is updated
    $("#menu").menu();
    $("#menu").menu("focus", null, firstItem );
    $("#menu").menu({
       select: function(event, ui){
            //if trigger select event: 
            //1. get the selected state and put the name in the input box
            var selectedState = ui.item.text();
            console.log("user select ->", selectedState);
            $("#states_input").val(selectedState);
            //2. empty the menu and then destroy it.
            $(this).empty();
            var isEmpty =  $('#menu').is(':empty') ;
            if(isEmpty){
                console.log("check empty");
                $("#menu").menu("destroy");
            }
            // $(this).menu("destroy");
            console.log("destroy click");
            //3.update the map according to selected state
            const stateName = selectedState.replace(" ", "+");
            //update links for map
            var newlink = map_url+stateName+","+location;
            $("#map").html("<iframe id='map_content' width='800' height='600' style='border:0' loading='lazy' allowfullscreen referrerpolicy='no-referrer-when-downgrade' src= '"+newlink+"'></iframe>");
            
        }
    });
    
}

function boldenStateName(matchedSubStrings, name, keyword, keywordLen){
    var prevLastIdx = 0;
    var boldenP = 0;
    var resString = "";

    while(keyword.test(name)){
        var lastIdx = keyword.lastIndex;
        resString += name.substring(prevLastIdx, lastIdx-keywordLen);
        resString += "<span>"+matchedSubStrings[boldenP]+"</span>";
        boldenP++;
        prevLastIdx = lastIdx;
    }
    resString += name.substring(prevLastIdx);

   
    // console.log("bolden name->",resString);
    return resString;
}

$(document).ready(function(){
    $("#map").html("<iframe id='map_content' width='800' height='600' style='border:0' loading='lazy' allowfullscreen referrerpolicy='no-referrer-when-downgrade' src= '"+link+"'></iframe>");
    $("#states_input").keyup(function(event){
        //get keyword at the input box as long as users add input there
        var input_text = $(this).val();
        console.log("current input ->",input_text);
        //which key is pressed
        var keycode = (event.keyCode ? event.keyCode : event.which);
        //if input is not empty and not blank
        if(input_text.length>0 && input_text.trim().length>0){
            //add items to menu or select 
            getData(input_text,keycode);
        }else if(!$('#menu').is(':empty')){
            //if input is empty or blank
            $("#menu").empty();
            $("#menu").menu("destroy");
        }
    });
});
</script>

<template>
    <div class = "row">
        <div class = "col-6" id = "typeahead_div">
            <div id = 'menu_div'>
                <input type = "text" id = "states_input" placeholder="Enter a US State"/>
                <ul id ="menu"></ul>
            </div>
        </div>
        <div class = "col-6">
            <div id = "map"></div>
        </div>
    </div>
</template>

<style scoped>
    #typeahead_div{
        margin-top: 60px;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    #typeahead_div > div{
        width:100%;
        font-size: 30px;
    }
    #states_input{
        width:100%;
        font-size: 30px;
    }
    #menu_div{
        display: block;
        width: 90%;
    }
    /* .ui-menu { 
        width: 100%; 
        margin:0 auto;
    } */
    #map{
        margin-top: 60px;
    }
</style>
