import { inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { PostMethods } from '../common/endpoints';




@Injectable({
    providedIn: 'root'
})
export class LinesService {

    selectedLinesIds: string[] = [];
    selectedLines: any[] = [];
    wagerCompileResponse: any = null;
    wagerConfirmResponse: any = null;
    wagerPostResponse: any = null;

    selectedPoints: { [betId: string]: any } = {};

    teaserOptions: any[] = [];
    loader: boolean = false;
    errorMsg: string = '';
    sumRisk: number = 0;
    sumWin: number = 0;
    dataReady: boolean = false;

    selectedCombinationIndex: number = 0;
    selectedTeaser: any;
    inputData: number = 0;
    useFreePlay: boolean = false;
    multiRR: boolean = false;

    selectedWagerTypeId: number = 0;
    selectedWagerType: string | undefined = 'STRAIGHT';
    wagerTypes = [
        { Type: 'STRAIGHT', Id: 0 },
        { Type: 'PARLAY', Id: 1 },
        { Type: 'TEASER', Id: 2 },
        { Type: 'ROUND ROBIN', Id: 5 }
    ]

    private subscription$: Subscription = new Subscription();
    apiService = inject(ApiService);

    addSelection(game: any, lineId: number) {

        const isTNT = game.Idspt == 'TNT';
        const spreadLine = lineId <= 1;
        const totalLine = lineId == 2 || lineId == 3;
        const selectionId = game.IdGame + '_' + lineId;
        const isDraw = lineId == 6;

        let line;
        let team = '';

        if (isTNT) {
            line = game.Lines.find((l: { Tmnum: number }) => l.Tmnum === lineId);
            team = line.Tmname;
        } else {
            line = game.Lines.length == 3 ? game.Lines[1] : game.Lines[0];
            team = isDraw ? "Draw" : (lineId == 0 || lineId == 2 || lineId == 4 ? game.Vtm : game.Htm);
        }

        // const isHome = team === game.Htm;

        const isHome = (lineId == 1 || lineId == 3 || lineId == 5);

        let selection = {
            IdLeague: game.idLeague,
            IdGame: game.IdGame,
            Play: lineId,
            IdSport: game.Idspt,
            Team: team,
            IsChild: false,
            IsLeagueGroup: false,
            IsDerivate: false,
            DerivateType: null,
            Derivatelvl: null,
            IsSpread: spreadLine,
            IsTotal: totalLine,
            IsOnOpenBets: false,
            IsTnt: isTNT,
            Ovt: line.Ovt || null,
            Tnum: line.Tmnum,
            ODPoints: null,
            Amount: 0,
            WinAmount: 0,
            GameDescription: game.gameDescription,
            Pitcher: 0,

            Date: game.Gmdt,
            Time: game.Gmtm,
            BetId: selectionId,
            TntDesc: isTNT ? game.Htm : '',
            newOdds: 0,
            newPoints: '',




            Rotation: 0,
            Points: 0,
            Odds: 0,
            PointsPurchased: 0,
            Selection: "0",
            LineValue: "0",
            LineOdds: "0",
            LinePoints: "0",
        };

        const setSelectionValues = (odds: string, selectionValue: string, lineOdds: string, linePoints: string, rotation?: number) => {
            selection.Odds = parseFloat(odds);
            selection.Selection = selectionValue;
            selection.LineValue = selectionValue;
            selection.LineOdds = lineOdds;
            selection.LinePoints = linePoints;
            if (rotation !== undefined) {
                selection.Rotation = rotation;
            }
        };

        if (isTNT) {
            selection.Rotation = line.Tmnum;
            selection.IsLeagueGroup = true;
            setSelectionValues(line.Odds, line.Oddsh, line.Odds, "0");

        } else if (spreadLine) {
            selection.Rotation = isHome ? game.Hnum : game.Vnum;
            selection.Points = parseFloat(isHome ? line.Hsprdt : line.Vsprdt);
            setSelectionValues(
                isHome ? line.Hsprdoddst : line.Vsprdoddst,
                isHome ? line.Hsprdh : line.Vsprdh,
                isHome ? line.Hsprdoddst : line.Vsprdoddst,
                isHome ? line.Hsprdt : line.Vsprdt
            );

        } else if (totalLine) {
            selection.Rotation = isHome ? game.Hnum : game.Vnum;
            selection.Points = parseFloat(isHome ? line.Unt : line.Ovt);
            setSelectionValues(
                isHome ? line.Unoddst : line.Ovoddst,
                isHome ? line.Unh : line.Ovh,
                isHome ? line.Unoddst : line.Ovoddst,
                isHome ? line.Unt : line.Ovt
            );

        } else if (isDraw) {
            selection.Rotation = game.Hnum + 1;
            setSelectionValues(line.Vspoddst, line.Vsph, line.Vspoddst, "0");

        } else {
            selection.Rotation = isHome ? game.Hnum : game.Vnum;
            setSelectionValues(
                isHome ? line.Hoddst : line.Voddst,
                isHome ? line.Hoddsh : line.Voddsh,
                isHome ? line.Hoddst : line.Voddst,
                "0"
            );
        }


        this.selectedLinesIds.push(selectionId);
        this.selectedLines.push(selection);

        this.reCompile()

    }

    removeSelection(game: any, lineId: number) {
        const selectionId = game.IdGame + '_' + lineId;
        this.selectedLinesIds = this.selectedLinesIds.filter(id => id !== selectionId);
        this.selectedLines = this.selectedLines.filter(line => !(line.Play === lineId && line.IdGame === game.IdGame));
        this.reCompile()
    }

    removeAllBets() {
        this.selectedLinesIds = [];
        this.selectedLines = [];
        this.selectWagerType(0)
        this.resetData();
    }

    selectWagerType(typeId: number) {
        this.selectedWagerTypeId = typeId;
        this.selectedWagerType = this.wagerTypes.find(wt => wt.Id == this.selectedWagerTypeId)?.Type;
        this.reCompile()
    }


    updateItemAmount(obj: any) {

    }

    setAllBetsAmount(amount: number) {

    }


    confirmBetAmount(amount: number) {
        this.confirmBet();
    }

    setCombination(combinationIndex: number) {

    }


    resetData() {
        this.dataReady = false;
        this.errorMsg = '';
        this.wagerConfirmResponse = null;
        this.wagerCompileResponse = null;
        this.wagerPostResponse = null;
        this.selectedPoints = {};
        this.teaserOptions = [];
        this.multiRR = false;
        this.sumRisk = 0;
        this.sumWin = 0;
    }

    reCompile() {
    
    }

    compileBet() {

    }

    placeStraightBet() {

    }

    confirmBet() {

    }


    placeBet() {

    }


    getTeaserCombinations() {

    }

}