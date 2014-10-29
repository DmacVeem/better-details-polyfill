describe("better-details-polyfill", function() {
    "use strict";

    var details, summary, defineSpy;

    beforeEach(function() {
        defineSpy = spyOn(Object, "defineProperty");
        details = DOM.mock("details>summary>`test`^p>`some text`");
        summary = details.child(0);
    });

    it("should make summary to be focusable", function() {
        expect(summary.get("tabindex")).toBe(0);
    });

    it("should toggle open attribute on summary click", function() {
        var getSpy = spyOn(details, "get"),
            setSpy = spyOn(details, "set");

        getSpy.and.returnValue(null);
        summary.fire("click");
        expect(setSpy).toHaveBeenCalledWith("open", true);

        getSpy.and.returnValue("open");
        summary.fire("click");
        expect(setSpy).toHaveBeenCalledWith("open", false);
    });

    it("should toggle details on space or enter key", function() {
        var getSpy = spyOn(details, "get"),
            setSpy = spyOn(details, "set");

        getSpy.and.returnValue(null);
        details.doToggleOpen(13);
        expect(setSpy).toHaveBeenCalledWith("open", true);

        getSpy.and.returnValue("open");
        details.doToggleOpen(14); // invalid key test
        expect(setSpy).not.toHaveBeenCalledWith("open", false);
        details.doToggleOpen(32);
        expect(setSpy).toHaveBeenCalledWith("open", false);
    });

    it("implements open attribute support", function() {
        var value = null;

        expect(details.doGetOpen(value)).toBe(false);
        value = details.doSetOpen(true);
        expect(details.doGetOpen(value)).toBe(true);
        value = details.doSetOpen(false);
        expect(details.doGetOpen(value)).toBe(false);
    });

    describe("toggle event", function() {
        it("is triggered on open attribute change", function() {
            var toggleSpy = jasmine.createSpy("toggle");

            DOM.find("body").append(details);

            details.on("toggle", toggleSpy);
            details.doSetOpen(true);
            expect(toggleSpy.calls.count()).toBe(1);

            spyOn(details, "get").and.returnValue(true);
            details.doSetOpen(false);
            expect(toggleSpy.calls.count()).toBe(2);

            details.remove();
        });

        it("does not bubble", function() {
            var toggleSpy = jasmine.createSpy("toggle"),
                bodySpy = jasmine.createSpy("body");

            DOM.find("body").append(details).on("toggle", bodySpy);

            details.on("toggle", toggleSpy).doSetOpen(true);
            expect(toggleSpy).toHaveBeenCalled();
            expect(bodySpy).not.toHaveBeenCalled();

            details.remove();
        });
    });
});
