import "babel-polyfill";
import mocha from "mocha";
import chai from "chai";
import { getJsonDiff } from "../src/JsonDiff";
const expect = chai.expect;

describe("Json Diff", function() {
    describe("#getJsonDiff", function() {
        it("should return the property diff between two object", function() {
            let res = getJsonDiff({}, { color: "blue" });
            expect(res[0]).to.equal("Add .color:blue");
        });
        it("should return the property inside property diff between two object", function() {
            let res = getJsonDiff({}, { color: { deep: "blue" } });
            expect(res[0]).to.equal("Add .color.deep:blue");
        });
        it("should return multi properties diff ", function() {
            let res = getJsonDiff(
                {},
                { color: { deep: "blue" }, shadow: "light" }
            );
            expect(res).to.deep.equal([
                "Add .color.deep:blue",
                "Add .shadow:light"
            ]);
        });
        it("should ignore properties that also exists in the old json ", function() {
            let res = getJsonDiff(
                { shadow: "light" },
                { color: { deep: "blue" }, shadow: "light" }
            );
            expect(res).to.deep.equal(["Add .color.deep:blue"]);
        });
        it("should not return anything when two json are the same ", function() {
            let res = getJsonDiff(
                { color: { deep: "blue" }, shadow: "light" },
                { color: { deep: "blue" }, shadow: "light" }
            );
            expect(res).to.deep.equal([]);
        });
        it("write update if value where changed ", function() {
            let res = getJsonDiff(
                { color: { deep: "blue" }, shadow: "light" },
                { color: { deep: "blue" }, shadow: "dark" }
            );
            expect(res).to.deep.equal(["Update .shadow:dark"]);
        });
        it("write Delete if the head is ahead  ", function() {
            let res = getJsonDiff(
                { color: { deep: "blue" }, shadow: "light" },
                { color: { deep: "blue" } }
            );
            expect(res).to.deep.equal(["Delete .shadow:light"]);
        });
    });
});
