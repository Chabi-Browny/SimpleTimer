
var TheTimer = function()
{
    this.Init = function()
    {
        var main_box = document.querySelector('.wrapper-main');
        
        TimerFrame(main_box);
        Dashboard(main_box);
        
        var EngineBox;
        var isRun = false;
        
        var Digits = 
            {
                day: document.querySelector('#day'),
                hour: document.querySelector('#hour'),
                min: document.querySelector('#min'),
                sec: document.querySelector('#sec'),
                ms: document.querySelector('#milisec'),
            };
        var Buttons = 
            {
                start: document.getElementById("go-btn"),
                stop: document.getElementById("stop-btn"),
                pause: document.getElementById("pause-btn"),
                day: document.getElementById("day-btn"),
            };
        var DisableBtns = 
            {
                start:'remove',
                stop:'remove',
                pause:'remove',
            };
        /**
         * it's start the Timer
         */
        Buttons.start.addEventListener(
            "click",
            function()
            {
                if( calcTimeValue() <= 0 )
                {
                    alert('Az idő összessége nagyobbnak kell lennie nullánál!');
                    return false;
                }
                
                isRun = true;
                EngineBox = timer( calcTimeValue(), Digits);
                DisableBtns.start = 'set';
                ChangeDisables(Buttons, DisableBtns);
            }
        );

        /**
         * it's stops the Timer
         */
        Buttons.stop.addEventListener(
            "click",
            function()
            {
                if( calcTimeValue() > 0 )
                    StopEvent(EngineBox, Buttons, Digits);
            }
        );

        /**
         * it's pause the Timer or continue
         */
        Buttons.pause.addEventListener(
            "click",
            function()
            {
                if(isRun === true)
                {
                    isRun = false;
                    clearInterval(EngineBox);
                    DisableBtns.start = 'remove';
                    ChangeDisables(Buttons, DisableBtns);
                }
                else
                {
                    isRun = true;
                    EngineBox = timer( calcTimeValue(), Digits, true);
                    Buttons.start.setAttribute('disabled','disabled');
                }
            }
        );
        /**
         * the Day input and digit switch
         */
        Buttons.day.addEventListener(
            'click',
            function()
            {
                var daySeparator = document.querySelector('#day-sep');
                var dayLabel = document.querySelector('#day-lbl');
                var dayInput = document.querySelector('#day-inp');
                
                if( dayLabel.getAttribute("class")=='' && dayInput.getAttribute("class")=='' )
                {
                    dayLabel.setAttribute('class','hide');
                    dayInput.setAttribute('class','hide');
                    dayInput.value = 0;
                    daySeparator.setAttribute('class','hide');
                    Digits.day.setAttribute('class','hide');
                    Buttons.day.value = '+Nap';
                }
                else
                {
                    dayLabel.setAttribute('class','');
                    dayInput.setAttribute('class','')
                    daySeparator.setAttribute('class','separator ');
                    Digits.day.setAttribute('class','char ');
                    Buttons.day.value = '-Nap';
                }
                
                if(isRun === true)
                    StopEvent(EngineBox, Buttons, Digits);
            }
        );
    }

    /**
     * @description - it's runs the runTime()
     * @param {type} start - the starting value - used if isn't pause
     * @param {type} Elems - the display elements
     * @param {type} pause - it's a pause marker
     * @returns {TheTimer.timer.cdt}
     */
    function timer( start, Elems, pause )
    {
        var hiddenCount = document.querySelector('#current-count');
        var currentCount = pause===true ? hiddenCount.value : start;
        var startTime = new Date().getTime() + parseInt(currentCount);
        
        var cdt = setInterval( function(){
                                runTime(startTime, Elems, hiddenCount, cdt);
                    }, 100);
        return cdt;
    }
    
    /**
     * @description - it do the essence of the counting
     * @param {type} StartT - the adjusted value+the current time
     * @param {type} Elements - the display elements
     * @param {type} HiddenInp - the counter holder input
     * @param {TheTimer.timer.cdt} Self - the running engine
     */
    function runTime(StartT, Elements, HiddenInp, Self)
    {
        var now = new Date().getTime();
        var diff = StartT - now;

        if( diff < 0 )
            { diff = 0; }
        HiddenInp.value = diff;

        var k60 = 1000*60;
        var d = Math.floor( diff/(k60*60*24) );
        var h = Math.floor( (diff % (k60*60*24))/(k60*60) );
        var m = Math.floor( (diff % (k60*60))/(k60) );
        var s = Math.floor( (diff % k60 )/1000 );

        Elements.day.innerHTML = (d < 10) ? '0'+d : d;
        Elements.hour.innerHTML = (h < 10) ? '0'+h : h;
        Elements.min.innerHTML = (m < 10) ? '0'+m : m;
        Elements.sec.innerHTML = (s < 10) ? '0'+s : s;
        Elements.ms.innerHTML = parseInt(((diff % 1000)/100)*10);
        
        if( d == 0 && h == 0 && m < 1 )
            setDisplayColors(true);
        else
            setDisplayColors();

        if( diff < 1)
        {
            document.getElementById("go-btn").removeAttribute('disabled','disabled');
            document.getElementById("pause-btn").setAttribute('disabled','disabled');
            setZeros(Elements);
            console.log('vége');
            clearInterval(Self);
        }
    }
    
    /**
     * @description - stop the event, and make necessary setups
     * @param {type} EngineBox - the runnig engine
     * @param {type} Btns - the button elements
     * @param {type} Digits - to the setting Zeros
     */
    function StopEvent(EngineBox, Btns, Digits)
    {
        var DisableBtns = 
            {
                start:'remove',
                stop:'remove',
                pause:'set',
            };
        clearInterval(EngineBox);
        ChangeDisables(Btns, DisableBtns);
        setZeros(Digits);
        setDisplayColors();
    }
    
    /**
     * @description - change some disable attributes, at matched elements
     * @param {type} Elems
     * @param {type} Setts
     */
    function ChangeDisables(Elems, Setts)
    {
        for( var setKey in Setts)
        {
            if( Setts[setKey] == 'set' )
                Elems[setKey].setAttribute('disabled','disabled');
            else if( Setts[setKey] == 'remove' )
                Elems[setKey].removeAttribute('disabled','disabled'); 
        }
    }
    
    /**
     * @description - calculate with input value in time parts
     * @returns {Number} - send back the calculated value
     */
    function calcTimeValue()
    {
        var k60 = 1000*60;
        var InputValue = 
            {
                day: document.querySelector('#day-inp').value,
                hour: document.querySelector('#hour-inp').value,
                min: document.querySelector('#minute-inp').value,
                sec: document.querySelector('#sec-inp').value,
            };
        var calcSecond = parseInt(InputValue.sec)*1000;
        var calcMin = parseInt(InputValue.min)*k60;
        var calcHour = parseInt(InputValue.hour)*k60*60;
        var calcDay = parseInt(InputValue.day)*k60*60*24;
        
        return calcDay+calcHour+calcMin+calcSecond;
    }
    
    /**
     * @description - set the zero segments in the display
     * @param {type} Elems
     */
    function setZeros(Elems)
    {
        Elems.day.innerHTML = '00';
        Elems.hour.innerHTML = '00';
        Elems.min.innerHTML = '00';
        Elems.sec.innerHTML = '00';
        Elems.ms.innerHTML = '00';
    }
    
    /**
     * @description - set the display colors
     * @param {type} warning - change to the warning color of the display
     */
    function setDisplayColors(warning)
    {
        var timer_box = document.querySelector('.timer-main-box');
        var body = document.body;
        if(warning===true)
        {
            body.style.backgroundColor = "#f00";
            timer_box.style.color = "#fff";
        }
        else
        {
            body.style.backgroundColor = "#fff";
            timer_box.style.color = "#000";
        }
    }

    /**
     * @description - it's make the timer Display
     * @param {type} parent - the box that hold the hole display
     * @param {type} day - 
     */
    function TimerFrame(parent, day)
    {
        var hide = day == 'day' ? '' : ' hide';
        var DisplayHolder = document.createElement('div');
        DisplayHolder.setAttribute('class','timer-main-box');
        DisplayHolder.innerHTML = '<span class="char'+hide+'" id="day">00</span>\n\
                                    <span class="separator'+hide+'" id="day-sep" >:</span>\n\
                                    <span class="char" id="hour">00</span>\n\
                                    <span class="separator">:</span>\n\
                                    <span class="char" id="min">00</span>\n\
                                    <span class="separator">:</span>\n\
                                    <span class="char" id="sec">00</span>\n\
                                    <span class="separator">:</span>\n\
                                    <span class="char" id="milisec">00</span>';
        parent.appendChild(DisplayHolder);
    }
    
    /**
     * @description - it's make dashborad of the timer
     * @param {type} parent
     * @param {type} day
     */
    function Dashboard(parent, day)
    {
        var hideDay ='';
        var DayBtn = '-Nap';
        
        if(day != 'day')
        {
            hideDay = ' hide';
            DayBtn = '+Nap';
        }
        var DashboardHolder = document.createElement('div');
        DashboardHolder.setAttribute('class','dashboard-box');
        DashboardHolder.innerHTML = '<form id="timer" method="get">\n\
                                        <input type="hidden" id="current-count" value="0">\n\
                                        <input type="button" id="day-btn" class="elem-center" value="'+DayBtn+'"><br>\n\
                                        <label id="day-lbl" class="'+hideDay+'">Nap:</label>\n\
                                        <input type="text" id="day-inp" class="'+hideDay+'" value="0">\n\
                                        <label>Óra:</label>\n\
                                        <input type="text" id="hour-inp" value="0">\n\
                                        <label>Perc:</label>\n\
                                        <input type="text" id="minute-inp" value="0">\n\
                                        <label>Másodperc:</label>\n\
                                        <input type="text" id="sec-inp" value="0"><br>\n\
                                        <div class="btn-box">\n\
                                            <input type="button" id="stop-btn" value="&#9724;"/>\n\
                                            <input type="button" id="pause-btn" value="&#10074;&#10074;" disabled />\n\
                                            <input type="button" id="go-btn" value="&#9658;" />\n\
                                        </div>\n\
                                    </form>';
        parent.appendChild(DashboardHolder);
    }

};
//TheTimer() vége       

(new TheTimer()).Init();