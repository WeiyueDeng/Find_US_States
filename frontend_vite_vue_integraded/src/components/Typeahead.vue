<script setup>
import { watch } from 'vue'
import gql from "graphql-tag";
import { ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client/core'
import {provideApolloClient, useQuery } from "@vue/apollo-composable";

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
// <ADD YOUR GOOGLE MAP API KEY>
//init map
const map_url = "https://www.google.com/maps/embed/v1/place?key=<ADD YOUR GOOGLE MAP API KEY>&q=";
const location = "United+States";
const link = map_url+location;

$(function completeStates(){
    //add embeded map into corresponding div
    $("#map").html("<iframe id='map_content' width='800' height='600' style='border:0' loading='lazy' allowfullscreen referrerpolicy='no-referrer-when-downgrade' src= '"+link+"'></iframe>");
    
    //get all states query via GraphQL
    const ALL_STATES = gql`
        query {
            getStates{
                name
                latitude
                longitude
            }
        }
    `;
    const {result} = useQuery(ALL_STATES)
    console.log("results", result);

    //convert data into array
    watch(result, value => {
        const statesArray = value.getStates;
        const allStates = []
        // const statesLocations = {}

        $.each(statesArray, function(idx, val){
            // console.log(idx, val.name)
            allStates.push(val.name);
            // statesLocations[val.name] = {"latitude": val.latitude, "longitude": val.longitude};
        });
        // console.log("states->",allStates);
        // console.log("statesInfo->",statesLocations);

        //enable autocomplete for the input box
        $("#states_input" ).autocomplete({
            source: allStates,
            autoFocus: true,
            classes: {
                "ui-autocomplete": "highlight"
            },
            open:function( event, ui ) {
                var acData = $(this).data('ui-autocomplete');
                // console.log("data->", acData.menu.element.find('li'));
                acData
                .menu
                .element
                .find('li')
                .each(function () {
                    var me = $(this);
                    // console.log("loop ele->", me.find("div"))
                    var keywords = acData.term.split(' ').join('|');
                    // console.log("loop keyword->", keywords)
                    var re = new RegExp( keywords, "gi" );
                    var match = me.find("div").text().match(re);
                    // console.log("match_part -> ",match)

                    //if find the matched part for the current text
                    if(match != null){
                        //use <span> to extract the matched part
                        var boldText =  me.find("div").text().replace(match[0], "<span>" + match[0] + "</span>");
                        // console.log("bold_text->", boldText)
                        me.find("div").html(boldText);
                    }
                    // // me.text(me.text().replace(new RegExp("(" + keywords + ")", "i"), '<b>$1</b>'));
                    // var t = me.text().replace( re, "<span class=required-drop>" + keywords + "</span>" );
                    // me.html(t);
                });
                //then bold all extracted part <span>
                $("span").css("font-weight", "bolder");
            },
            select: function(event, ui){
                //as long as users select a state in the menu, the map updates
                var stateSelected = ui.item.value;
                // var latitude = statesLocations[stateSelected]["latitude"];
                // var longitude = statesLocations[stateSelected]["longitude"];
                const stateName = stateSelected.replace(" ", "+");
                // console.log(stateName)
                //update links for map
                var newlink = map_url+stateName+","+location;
                console.log(newlink)
                $("#map").html("<iframe id='map_content' width='800' height='600' style='border:0' loading='lazy' allowfullscreen referrerpolicy='no-referrer-when-downgrade' src= '"+newlink+"'></iframe>");
                // console.log("stateSelected_lat->", stateSelected, latitude);
            }
            
        });

    })
    
})
</script>

<template>
    <input completeStates type = "text" id = "states_input" placeholder="Enter a US State"/>
    <div id = "map"></div>
</template>

<style scoped>
    #states_input{
        margin-top: 20px;
        width:600px;
        font-size: 30px;
    }
    #map{
        margin-top: 60px;
    }
</style>
